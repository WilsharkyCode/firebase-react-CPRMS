import React, { useCallback, useState, useMemo } from "react";
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
  Toolbar,
  Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { ref, remove } from "firebase/database";
import { database } from "../../config/firebase-config";
import EditIcon from "../../components/Icons/edit-icon-white.png";
import TrashIcon from "../../components/Icons/trash-icon-white.png";
import BasicModal from "../../components/MaterialUI/MaterialModal";

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
  { id: "date", label: "Date" },
  { id: "procedure", label: "Procedure" },
  { id: "amountPaid", label: "Amount Paid" },
  { id: "balance", label: "Balance" },
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
            {headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
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

//MAIN FUNCTION START
export default function TreatmentDTable({ data, patientData }) {
  const filteredData = useMemo(
    () =>
      data.filter(
        (record) =>
          record.patientID && record.patientID.toString().includes(patientData.id)
      ),
    [data, patientData]
  );

  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

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

  const deleteRecords = useCallback((id) => {
    remove(ref(database, "TreatmentRecords/" + id));
    console.log("Delete Success");
  }, []);

  const cacheData = useCallback((key, treatmentData) => {
    const jsonString = JSON.stringify(treatmentData);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    if ("caches" in window) {
      caches.open(key).then((cache) => {
        cache.put(key, new Response(encrypted));
        console.log("Encrypted & Cached:", encrypted);
      });
    }
  }, []);

  const startEditing = useCallback(
    (e, record) => {
      e.preventDefault();
      cacheData("TreatmentRecordData", record);
      navigate("/edittreatmentrecord");
    },
    [navigate, cacheData]
  );

  const sortedData = useMemo(
    () => filteredData.slice().sort(getComparator(order, orderBy)),
    [filteredData, order, orderBy]
  );

  const paginatedData = useMemo(
    () =>
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2,borderRadius: 4}}>
        <Toolbar>
          <Typography className="font-semibold text-slate-500">PATIENT NAME: {patientData.firstName} {patientData.middleName} {patientData.lastName}</Typography>
        </Toolbar>
        <TableContainer>
          <Table size="medium">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {paginatedData.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{record.date}</TableCell>
                  <TableCell sx={{ minWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {record.procedure}
                  </TableCell>
                  <TableCell>{record.amountPaid}</TableCell>
                  <TableCell>{record.balance}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <BasicModal
                        ButtonName={"VIEW PROCEDURE"}
                        Header={"PROCEDURE DETAILS:"}
                        Body={record.procedure}
                      />
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          className="icons-btn bg-emerald-400 hover:bg-emerald-500"
                          onClick={(e) => startEditing(e, record)}
                        >
                          <img
                            src={EditIcon}
                            alt="Edit"
                            width="20px"
                            height="20px"
                          />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          className="icons-btn bg-red-400 hover:bg-red-500"
                          onClick={() => deleteRecords(record.id)}
                        >
                          <img
                            src={TrashIcon}
                            alt="Delete"
                            width="20px"
                            height="20px"
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
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
