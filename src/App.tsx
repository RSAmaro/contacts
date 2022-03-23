
import { CircularProgress, Container, TableContainer, TablePagination } from '@mui/material';
import { useEffect, useState } from 'react';
import './App.css';
import TableComponent from './components/Table';
import { Contact, returnCollumns } from './interfaces/Contact';
import { Api } from './services/Axios';


function App() {
  const db = new Api();

  const [rowData, setRowData] = useState<Contact[]>([]);
  const collumns: string[] = returnCollumns();

  const [q, setQ] = useState("");
  const [searchCollumns, setSearchCollumns] = useState([
    'id',
  ]);

  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(5);

  const [sort, setSort] = useState("");

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function getData() {
    setLoading(true);

    setRowData(await db.getRows((page + 1), perPage, sort));
    setCount(db.count);

    setLoading(false);
  }

  useEffect(() => {
    getData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, sort]);

  // Pagination Handles
  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleSearch = (event: any, value: string) => {
  //   console.log(value);
  // }

  const headerHandleClick = async (value: any) => {
    if (sort === "") { return setSort(value); }
    if (sort === value) { return setSort(value + "_desc"); }
    if (sort === value.concat("_desc")) { return setSort(""); }
    return setSort(value);
  }

  function Search() {

  }

  return (
    <div className="App">
      <Container className="App">

        <input type="text" value={q} onChange={(e) => setQ(e.target.value)} />
        {collumns &&
          collumns.map((column) => (

            <label>
              <input
                type='checkbox'
                checked={searchCollumns.includes(column)}
                onChange={(e) => {
                  const checked = searchCollumns.includes(column);
                  setSearchCollumns((prev: any) =>
                    checked
                      ? prev.filter((sc: any) => sc !== column)
                      : [...prev, column],
                  );
                }}
              />
              {column}
            </label>

          ))}

        <TableContainer>
          <TableComponent data={rowData} sort={sort} onClickSort={headerHandleClick}></TableComponent>
        </TableContainer>


        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={perPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          showFirstButton={true}
          showLastButton={true}
        />
      </Container>
    </div>
  );
}

export default App;
