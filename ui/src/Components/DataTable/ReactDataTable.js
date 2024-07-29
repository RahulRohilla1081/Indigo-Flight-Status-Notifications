import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ReactDataTable.css";

const ReactDataTable = ({
  data,
  columns,
  pageCount,
  headerFont,
  bodyFont,
  loading,
  action,
}) => {
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    let skeletonTimer;

    if (data && data.length > 0) {
      // Clear the skeleton timer and hide the skeleton
      clearTimeout(skeletonTimer);
      setShowSkeleton(false);
    } else {
      // Set up the skeleton timer
      skeletonTimer = setTimeout(() => {
        setShowSkeleton(false);
      }, 3000);
    }

    return () => {
      // Clean up the timer if the component unmounts
      clearTimeout(skeletonTimer);
    };
  }, [data]);

  const tableData = {
    columns: columns,
    data: showSkeleton ? [] : data,
  };

  const cellStyle = {
    borderRight: "1.4px solid #ddd",
    fontSize: bodyFont ? bodyFont : "15px",
  };

    if (showSkeleton) {
      return (
        <div className="p-3">
          <SkeletonTheme baseColor="#dedede" highlightColor="gray">
            <div>
              {/* <div className="table-responsive">
              <div className="dataTables_wrapper dt-bootstrap4"> */}
              <Skeleton height={50} count={1} style={{ marginTop: "40px" }} />
              <Skeleton height={30} count={5} />
              {/* </div>
            </div> */}
            </div>
          </SkeletonTheme>
        </div>
      );
    }

  if (!data || data.length === 0) {
    return (
      <>
        <div className="min-w-full">
          <div className="dataTables_wrapper dt-bootstrap4 min-w-full">
            <div
              // className="card"
              style={{
                marginTop: 50,
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  fontSize: "18px",
                  color: "#999",
                }}
              >
                No data available
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <div className="dataTables_wrapper dt-bootstrap4">
          <DataTableExtensions
            columns={columns}
            data={data}
            print={false}
            exportHeaders={false}
            export={false}
            filterPlaceholder="Search"
            {...tableData}
          >
            <DataTable
              columns={columns}
              data={data}
              pagination
              striped
              highlightOnHover
              dense
              noHeader
              paginationPerPage={pageCount ? pageCount : 5}
              paginationRowsPerPageOptions={[5, 10, 15]}
              paginationComponentOptions={{
                rowsPerPageText: "Show:",
                rangeSeparatorText: "of",
                noRowsPerPage: false,
                selectAllRowsItem: true,
                selectAllRowsItemText: "All",
              }}
              customStyles={{
                table: {
                  style: {
                    marginBottom: 0,
                    fontSize: "17px",
                    // className: "table table-bordered table-hover",
                    // border: "1.4px solid #ddd", // Add border to the table
                    // width: '100%', // Set table width to 100%
                  },
                },
                tableWrapper: {
                  style: {
                    borderRadius: "1.4px",
                    boxShadow: "none",
                  },
                },
                pagination: {
                  className: "pagination pagination-sm",
                },
                headCells: {
                  style: {
                    height: 35,
                    fontSize: headerFont ? headerFont : "17px",
                    fontWeight: "bold",
                    backgroundColor: "#22AAD2",
                    color: "#fff",

                    display: "flex",
                    justifyContent: "center",
                    // borderRight: "1.4px solid #ddd", // Add border to the header
                  },
                },
                cells: {
                  style: {
                    ...cellStyle,
                    display: "flex",
                    justifyContent: "center",
                    borderWidth: 0,
                    height: 45,
                  },
                },
              }}
            />
          </DataTableExtensions>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ReactDataTable);
