"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./main.module.scss";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
  Tooltip,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSession } from "next-auth/react";
import ky from "ky";
import NoTasks from "../Empty/NoTasks";
import CardSkeleton from "@/components/common/CardSkeleton";
import Loading from "@/components/common/Loading";
import toast from "react-hot-toast";
import UpdateForm from "../Home/UpdateForm";
import Modal from "@/components/common/Modal";
import { nunito } from "@/app/fonts/font";

const TaskList = ({ onEdit, refresh, setRefresh }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedDueDate, setSelectedDueDate] = useState("All");

  const hasFetched = useRef(false);
  const { data: session, status } = useSession();
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "asc",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ky
          .get(`/api/tasks?id=${session.user.id}`)
          .json();
        setTasks(response);
        setFilteredTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setFetched(true);
      }
    };

    if (
      status === "authenticated" &&
      session?.user?.id &&
      (!hasFetched.current || refresh)
    ) {
      hasFetched.current = true;
      fetchData();
    }
  }, [refresh, session?.user?.id, status]);

  useEffect(() => {
    if (!tasks.length) return;

    let updatedTasks = [...tasks];

    if (selectedStatus !== "All") {
      updatedTasks = updatedTasks.filter(
        (task) => task.status === selectedStatus
      );
    }
    if (selectedPriority !== "All") {
      updatedTasks = updatedTasks.filter(
        (task) => task.priority === selectedPriority
      );
    }
    if (selectedDueDate !== "All") {
      const now = new Date();
      updatedTasks = updatedTasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        if (selectedDueDate === "Today") {
          return taskDate.toDateString() === now.toDateString();
        }
        if (selectedDueDate === "This Week") {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay()); // Get Sunday of this week
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6); // Get Saturday of this week
          endOfWeek.setHours(23, 59, 59, 999);

          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        }
        return true;
      });
    }

    setFilteredTasks(updatedTasks);
  }, [selectedStatus, selectedPriority, selectedDueDate, tasks]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortTasks = (tasks) => {
    const priorityOrder = { Low: 1, Medium: 2, High: 3 };
    const statusOrder = { "Not Started": 1, "In Progress": 2, Completed: 3 };

    return [...tasks].sort((a, b) => {
      const { key, direction } = sortConfig;

      if (key === "title" || key === "status" || key === "priority") {
        const aValue =
          key === "priority"
            ? priorityOrder[a[key]]
            : key === "status"
            ? statusOrder[a[key]]
            : a[key]?.toLowerCase();
        const bValue =
          key === "priority"
            ? priorityOrder[b[key]]
            : key === "status"
            ? statusOrder[b[key]]
            : b[key]?.toLowerCase();

        if (aValue < bValue) return direction === "asc" ? -1 : 1;
        if (aValue > bValue) return direction === "asc" ? 1 : -1;
        return 0;
      }

      if (key === "dueDate") {
        const aDate = new Date(a[key]);
        const bDate = new Date(b[key]);
        return direction === "asc" ? aDate - bDate : bDate - aDate;
      }

      return 0;
    });
  };

  const sortedTasks = sortTasks(filteredTasks);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", "");
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await ky.delete(`/api/tasks?id=${id}`).json();
      if (response.success) {
        setTasks(response.data);
        toast.success(response.message);
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (task) => {
    setModalOpen(true);
    setEditData(task);
  };

  if (status === "loading") return <CardSkeleton />;
  if (!fetched) return <CardSkeleton />;
  if (fetched && (!tasks || tasks.length < 1)) return <NoTasks />;

  return (
    <>
      {loading && <Loading />}
      {modalOpen && (
        <Modal
          headline="Updating Task"
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        >
          <UpdateForm
            setModalOpen={setModalOpen}
            setRefresh={setRefresh}
            data={editData}
          />
        </Modal>
      )}
      <div className={styles.main}>
        <Box sx={{ width: "100%", padding: 2 }}>
          <div className={`${styles.dropdown} ${nunito.className}`}>
            <span>
              <label>Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </span>

            <span>
              <label>Priority:</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </span>

            <span>
              <label>Due Date:</label>
              <select
                value={selectedDueDate}
                onChange={(e) => setSelectedDueDate(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
              </select>
            </span>
          </div>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer>
              <Table stickyHeader aria-label="task table">
                <TableHead className={styles.header}>
                  <TableRow>
                    {["title", "dueDate", "status", "priority"].map(
                      (column) => (
                        <TableCell key={column}>
                          <TableSortLabel
                            active={sortConfig.key === column}
                            direction={
                              sortConfig.key === column
                                ? sortConfig.direction
                                : "asc"
                            }
                            onClick={() => handleSort(column)}
                          >
                            {column.charAt(0).toUpperCase() + column.slice(1)}
                          </TableSortLabel>
                        </TableCell>
                      )
                    )}
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTasks
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((task) => (
                      <TableRow hover key={task._id}>
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{formatDate(task.dueDate)}</TableCell>
                        <TableCell
                          className={`${styles.status} ${
                            task.status === "Not Started"
                              ? styles.notStarted
                              : task.status === "In Progress"
                              ? styles.inProgress
                              : styles.completed
                          }`}
                        >
                          {task.status}
                        </TableCell>

                        <TableCell
                          className={`${styles.priority} ${
                            task.priority === "Low"
                              ? styles.low
                              : task.priority === "Medium"
                              ? styles.medium
                              : styles.high
                          }`}
                        >
                          {task.priority}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(task)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(task._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tasks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default TaskList;
