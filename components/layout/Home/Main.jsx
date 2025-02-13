"use client";
import { domine } from "@/app/fonts/font";
import styles from "./main.module.scss";
import { useState } from "react";
import Modal from "@/components/common/Modal";
import CreateForm from "./CreateForm";
import TaskList from "../Tasks/Main";

const Main = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  return (
    <>
      {modalOpen && (
        <Modal
          headline="Adding New Task"
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        >
          <CreateForm
            setModalOpen={setModalOpen}
            setRefresh={setRefresh}
          />
        </Modal>
      )}
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.create}>
            <button
              onClick={() => setModalOpen(!modalOpen)}
              className={domine.className}
            >
              Add a new task
            </button>
          </div>
        </div>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <TaskList refresh={refresh} setRefresh={setRefresh} />
        </div>
      </div>
    </>
  );
};

export default Main;
