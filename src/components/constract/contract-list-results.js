import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import * as React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Card,
  Checkbox, Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { deleteAccounts, getAllAccount } from 'src/api/accountApi';
import { Status } from './StatusBar';
import { contractApprove, contractClose, getAllContract } from '../../api/contractApi';
import { ContractDetail } from './constract-detail';
import Checkout from './contract-form';

export const ContractListResults = ({ ...rest }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const fetchContractList = async () => {
      try {
        const response = await getAllContract();
        setContracts(response);
        console.log(response);
        console.log('Success to ccount list from server');
      } catch (error) {
        console.log(error);
      }
    };
    fetchContractList();
  }, contracts);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = contracts.map((customer) => customer.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickDelete = (event) => {
    try {
      deleteAccounts(selectedCustomerIds);
      setContracts(contracts.filter(account => {
        return selectedCustomerIds.includes(account.id);
      }));
      setSelectedCustomerIds([]);
    } catch (error) {
      console.log(error);
    }
  };

  const approve = (event, id) => {
    contractApprove(id);
    window.location.reload();
  };

  const cancel = (event, id) => {
    contractClose(id);
    window.location.reload();
  };

  const [contractSelected, setContractSelected] = useState({});
  const [check, setCheck] = useState(false);

  const close = () => {
    setCheck(false);
  };

  return (
    <Card {...rest}>
      <Dialog open={check}>
        <ContractDetail contract={contractSelected} close={close}/>
      </Dialog>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  {/*<Checkbox*/}
                  {/*  checked={selectedCustomerIds.length === contracts.length}*/}
                  {/*  color="primary"*/}
                  {/*  indeterminate={*/}
                  {/*    selectedCustomerIds.length > 0*/}
                  {/*    && selectedCustomerIds.length < contracts.length*/}
                  {/*  }*/}
                  {/*  onChange={handleSelectAll}*/}
                  {/*/>*/}
                </TableCell>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  Product
                </TableCell>
                <TableCell>
                  Customer
                </TableCell>
                <TableCell>
                  Start date
                </TableCell>
                <TableCell>
                  End date
                </TableCell>
                <TableCell>
                  STATUS
                </TableCell>
                <TableCell>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.slice(0, limit).map((contract) => (
                <TableRow
                  hover
                  key={contract.id}
                  selected={selectedCustomerIds.indexOf(contract.id) !== -1}
                  onClick={() => {
                    setContractSelected(contract);
                    setCheck(true);
                  }}
                >
                  <TableCell padding="checkbox">
                    {/*<Checkbox*/}
                    {/*  checked={selectedCustomerIds.indexOf(contract.id) !== -1}*/}
                    {/*  onChange={(event) => handleSelectOne(event, contract.id)}*/}
                    {/*  value="true"*/}
                    {/*/>*/}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {contract.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell style={{
                    whiteSpace: 'normal',
                    wordWrap: 'break-word'
                  }}>
                    {contract.product.map(x => x.name + ',')}
                  </TableCell>
                  <TableCell>
                    {contract.customer.name}
                  </TableCell>
                  <TableCell>
                    {contract.dateStart}
                  </TableCell>
                  <TableCell>
                    {contract.dateEnd}
                  </TableCell>
                  <TableCell>
                    <Status status={contract.status}/>
                  </TableCell>
                  {
                    contract.status === 'PENDING' && <TableCell>
                      <IconButton color="secondary"
                                  onClick={(event) => approve(event, contract.id)}>
                        <CheckIcon/>
                      </IconButton>
                      <IconButton color="error" onClick={(event) => cancel(event, contract.id)}>
                        <CloseIcon/>
                      </IconButton>
                    </TableCell>
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={contracts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ContractListResults.propTypes = {
  customers: PropTypes.array.isRequired
};
