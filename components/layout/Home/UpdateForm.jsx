"use client";
import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import ky from "ky";
import toast from "react-hot-toast";
import Loading from "@/components/common/Loading";
import Input from "@/components/common/Input";
import DateTimePicker from "@/components/common/DateTimePicker";
import Dropdown from "@/components/common/Dropdown";
import { domine, nunito } from "@/app/fonts/font";
import styles from "./main.module.scss";
import TextArea from "@/components/common/TextArea";

const UpdateForm = ({ setModalOpen, setRefresh, data }) => {
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  const formatInfoDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const initialValues = {
    title: data.title,
    description: data.description,
    dueDate: formatDateTime(data.dueDate),
    status: data.status,
    priority: data.priority,
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters long")
      .max(50, "Title can't be more than 50 characters long"),
    description: Yup.string().max(
      300,
      "Description can't be more than 300 characters long"
    ),
    dueDate: Yup.date().required("Due Date is required"),
    status: Yup.string().required("Status is required"),
    priority: Yup.string().required("Priority is required"),
  });

  const submitHandler = async (values, { resetForm }) => {
    setError(null);
    setLoading(true);
    setRefresh(false);

    try {
      const response = await ky
        .put(`/api/tasks?id=${data._id}`, {
          json: { data: values },
          throwHttpErrors: false,
        })
        .json();

      if (response.success) {
        toast.success(response.message);
        resetForm();
        setModalOpen(false);
        setRefresh((prev) => !prev);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className={styles.card}>
        <p className={`${styles.info} ${nunito.className}`}>
          Task created at {formatInfoDate(data.createdAt)} and last updated at{" "}
          {formatInfoDate(data.updatedAt)}
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
          {({ resetForm, handleChange, values }) => (
            <Form>
              <Input
                label="Title"
                name="title"
                type="text"
                placeholder="Task title here..."
                value={values.title}
                onChange={handleChange}
              />
              <TextArea
                label="Description"
                name="description"
                type="text"
                placeholder="(Optional)"
                value={values.description}
                onChange={handleChange}
              />
              <DateTimePicker
                label="Due Date"
                name="dueDate"
                value={values.dueDate}
                onChange={handleChange}
              />
              <Dropdown
                label="Status"
                name="status"
                options={["Not Started", "In Progress", "Completed"]}
                value={values.status}
                onChange={handleChange}
              />
              <Dropdown
                label="Priority"
                name="priority"
                options={["Low", "Medium", "High"]}
                value={values.priority}
                onChange={handleChange}
              />

              {error && (
                <div className={`${styles.error} ${nunito.className}`}>
                  {error}
                </div>
              )}

              <div className={`${styles.buttons} ${domine.className}`}>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setError(null);
                  }}
                  className={styles.reset}
                >
                  Reset
                </button>
                <button className={styles.submit} type="submit">
                  Create Task
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default UpdateForm;
