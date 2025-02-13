"use client";
import LogoutButton from "@/components/common/LogoutButton";
import styles from "./main.module.scss";
import { FaUser } from "react-icons/fa";
import { nunito } from "@/app/fonts/font";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ky from "ky";

const Profile = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState();

  useEffect(() => {
    if (status === "authenticated" && !user) {
      const fetchData = async () => {
        try {
          const response = await ky.get(`/api/me?id=${session.user.id}`).json();
          setUser(response);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [session, user]);

  return (
    <div className={styles.profile}>
      <LogoutButton />
      <span className={nunito.className}>
        <FaUser />
        {user ? `Hello, ${user.firstName}` : "Profile"}
      </span>
    </div>
  );
};

export default Profile;
