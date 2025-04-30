import React, { useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  IconButton,
  Tooltip,
  Collapse,
  Typography,
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ref, remove, onValue } from "firebase/database";
import { database } from "../../config/firebase-config";
import EditIcon from "../../components/Icons/edit-icon-white.png";
import TrashIcon from "../../components/Icons/trash-icon-white.png";
import ballot from '../../components/Icons/ballot.png';

const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: "expand", label: "" },
  { id: "itemName", label: "Item Name" },
  { id: "itemQuantity", label: "Quantity" },
  { id: "itemCategory", label: "Category" },
  { id: "branchName", label: "Branch" },
  { id: "actions", label: "Actions" },
];

function EnhancedTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id !== "actions" && headCell.id !== "expand" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc" ? "sorted descending" : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function InventoryTable({ data }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("itemName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [branchFilter, setBranchFilter] = useState("All");
  const [openRow, setOpenRow] = useState(null);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    const catRef = ref(database, "ItemCategory/");
    onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setCategories(loaded);
    });
  }, []);

  // Fetch branches
  useEffect(() => {
    const branchRef = ref(database, "Branches/");
    onValue(branchRef, (snapshot) => {
      const data = snapshot.val();
      const loaded = data
        ? Object.keys(data).map((key) => ({ id: key, ...data[key] }))
        : [];
      setBranches(loaded);
    });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteInventory = useCallback((id) => {
    remove(ref(database, "Inventory/" + id));
    console.log("Delete Success");
  }, []);

  const cacheData = useCallback((key, data) => {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    if ("caches" in window) {
      caches.open(key).then((cache) => {
        cache.put(key, new Response(encrypted));
        console.log("Encrypted & Cached:", encrypted);
      });
    }
  }, []);

    const openTransactions = useCallback(
      (e, item) => {
        e.preventDefault();
        cacheData("InventoryItemData", item);
        console.log('Caching success');
        navigate('/inventory/transactions');
      },
      [navigate, cacheData]
    );

  const startEditing = useCallback(
    (e, item) => {
      e.preventDefault();
      cacheData("InventoryItemData", item);
      navigate("/inventory/editinventory");
    },
    [navigate, cacheData]
  );

  // Map category and branch ids to names
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.categoryName : "Unknown";
  };

  const getBranchName = (branchId) => {
    const branch = branches.find((br) => br.id === branchId);
    return branch ? branch.branchName : "Unknown";
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const categoryMatch =
        categoryFilter === "All" || String(item.categoryID) === String(categoryFilter);
      const branchMatch =
        branchFilter === "All" || String(item.branchID) === String(branchFilter);
      return categoryMatch && branchMatch;
    });
  }, [data, categoryFilter, branchFilter]);
  

  const sortedData = useMemo(
    () => filteredData.slice().sort(getComparator(order, orderBy)),
    [filteredData, order, orderBy]
  );

  const paginatedData = useMemo(
    () => sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2, borderRadius: 4 }}>
        <Toolbar
        sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "baseline" },
            justifyContent: "space-between",
            gap: 2,
            py: 3,
        }}
        >
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Sort by:
        </Typography>

        <Box
            sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
            }}
        >
            <FormControl size="small" sx={{ width: { xs: "100%", sm: "200px" } }}>
            <InputLabel>Category</InputLabel>
            <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
            >
                <MenuItem value="All">All</MenuItem>
                {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                    {category.categoryName}
                </MenuItem>
                ))}
            </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: { xs: "100%", sm: "200px" } }}>
            <InputLabel>Branch</InputLabel>
            <Select
                value={branchFilter}
                label="Branch"
                onChange={(e) => setBranchFilter(e.target.value)}
            >
                <MenuItem value="All">All</MenuItem>
                {branches.map((branch) => (
                <MenuItem key={branch.id} value={branch.id}>
                    {branch.branchName}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
        </Box>
        </Toolbar>
        <Divider sx={{ bgcolor: 'gray' }} />
        <TableContainer>
          <Table size="medium">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {paginatedData.map((item) => {
                const isOpen = openRow === item.id;
                return (
                  <React.Fragment key={item.id}>
                    <TableRow hover>
                      <TableCell>
                        <Tooltip title="View More" arrow>
                          <IconButton size="small" onClick={() => setOpenRow(isOpen ? null : item.id)}>
                            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.itemQuantity}</TableCell>
                      <TableCell>{getCategoryName(item.categoryID)}</TableCell>
                      <TableCell>{getBranchName(item.branchID)}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Open Records" arrow>
                            <IconButton className="icons-btn border bg-slate-50 hover:bg-slate-400" onClick={(e) => openTransactions(e, item)}>
                              <img src={ballot} alt="Open Records" width="20px" height="20px" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit" arrow>
                            <IconButton className="icons-btn bg-emerald-400 hover:bg-emerald-500" onClick={(e) => startEditing(e, item)}>
                              <img src={EditIcon} alt="Edit" width="20" height="20" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <IconButton className="icons-btn bg-red-400 hover:bg-red-500" onClick={() => deleteInventory(item.id)}>
                              <img src={TrashIcon} alt="Delete" width="20" height="20" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="subtitle1" gutterBottom>
                              Additional Info:
                            </Typography>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Supplier</TableCell>
                                  <TableCell>Date Bought</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>{item.supplierName}</TableCell>
                                  <TableCell>{item.dateBought}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
