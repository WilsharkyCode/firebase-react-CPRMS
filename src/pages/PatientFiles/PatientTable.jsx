import React, { useCallback, useState, useMemo, useEffect } from 'react';
import CryptoJS from "crypto-js";

import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Paper,
  IconButton, Tooltip, Collapse, Typography
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ballot from '../../components/Icons/ballot.png';
import EditIcon from '../../components/Icons/edit-icon-white.png';
import WarningModal from '../../components/MaterialUI/WarningMUI';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const headCells = [
  { id: 'expand', numeric: false, label: '' },
  { id: 'id', numeric: false, label: 'Patient ID' },
  { id: 'firstName', numeric: false, label: 'First Name' },
  { id: 'lastName', numeric: false, label: 'Last Name' },
  { id: 'middleInitial', numeric: false, label: 'Middle Initial' },
  { id: 'actions', numeric: false, label: 'Actions' },
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
            align="left"
            sortDirection={orderBy === headCell.id ? order : false}
            style={headCell.id === 'actions' ? { width: 200 } : {}}
          >
            {headCell.id !== 'actions' && headCell.id !== 'expand' ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
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
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

//Advanced Encryption Standard Key
const SECRET_KEY = process.env.REACT_APP_AES_ENCRYPTION_KEY; 

export default function PatientTable({ data, dataRecords }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openRow, setOpenRow] = useState(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const cacheData = useCallback((key, patientData) => {
    const jsonString = JSON.stringify(patientData);

    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();

    if ("caches" in window) {
      caches.open(key).then((cache) => {
        cache.put(key, new Response(encrypted));
        console.log("Encrypted & Cached:", encrypted);
      });
    }
  }, []);

  const openTreatmentRecord = useCallback(
    (e, patientData) => {
      e.preventDefault();
      cacheData('PatientData', patientData);
      console.log('Caching success');
      navigate('/patient/treatment');
    },
    [navigate, cacheData]
  );

  const startEditing = useCallback(
    (e, patientData) => {
      e.preventDefault();
      cacheData('PatientData', patientData);
      console.log('Caching success');
      navigate('/patient/edit');
    },
    [navigate, cacheData]
  );

  const sortedData = useMemo(
    () => data.slice().sort(getComparator(order, orderBy)),
    [data, order, orderBy]
  );

  const paginatedData = useMemo(
    () =>
      sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedData, page, rowsPerPage]
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 ,borderRadius: 4}}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={isMobile ? 'small' : 'medium'}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {paginatedData.map((patient) => {
                const isOpen = openRow === patient.id;
                return (
                  <React.Fragment key={patient.id}>
                    <TableRow hover sx={{ cursor: 'pointer' }}>
                      <TableCell>
                        <Tooltip title="View Other Info" arrow>
                          <IconButton size="small" onClick={() => setOpenRow(isOpen ? null : patient.id)}>
                            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.firstName}</TableCell>
                      <TableCell>{patient.lastName}</TableCell>
                      <TableCell>{patient.middleInitial}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Tooltip title="Open Records" arrow>
                            <IconButton className="icons-btn border bg-slate-50 hover:bg-slate-400" onClick={(e) => openTreatmentRecord(e, patient)}>
                              <img src={ballot} alt="Open Records" width="20px" height="20px" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit" arrow>
                            <IconButton className="icons-btn bg-emerald-400 hover:bg-emerald-500" onClick={(e) => startEditing(e, patient)}>
                              <img src={EditIcon} alt="Edit" width="20px" height="20px" />
                            </IconButton>
                          </Tooltip>
                          <WarningModal id={patient.id} dataRecords={dataRecords} />
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                          <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                              Additional Information:
                            </Typography>
                            <Table size="small" aria-label="purchases">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Birthday </TableCell>
                                  <TableCell>Age</TableCell>
                                  <TableCell>Email</TableCell>
                                  <TableCell>Phone Number</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow>
                                  <TableCell>{patient.birthday}</TableCell>
                                  <TableCell>{patient.age}</TableCell>
                                  <TableCell>{patient.email}</TableCell>
                                  <TableCell>{patient.phoneNum}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                            <Typography variant="body2">More detailed patient info or history can go here.</Typography>
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
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
