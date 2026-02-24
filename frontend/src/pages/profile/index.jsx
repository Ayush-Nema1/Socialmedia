import { getAboutUser, getAllUser } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/dashboardlayout";
import Userlayout from "@/layout/userlayout";
import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { base_URL, clientServer } from "@/config";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function Profilepage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const postReducer = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setuserPosts] = useState([]);

  const [isModalopen, setisModalopen] = useState(false);
  const [isModalopen2, setisModalopen2] = useState(false);

  const [handlework, sethandlework] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [edu, setedu] = useState({ school: "", degree: "", fieldOfStudy: "" });

  const handleWorkInputWork = (e) => {
    const { name, value } = e.target;
    sethandlework({ ...handlework, [name]: value });
  };
  const handleEducationInput = (e) => {
    const { name, value } = e.target;
    setedu({ ...edu, [name]: value });
  };

  /* ================= FETCH USER ================= */
  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  /* ================= SYNC DATA ================= */
  useEffect(() => {
    if (authState.user != undefined) {
      setUserProfile(authState.user);

      if (authState.user) {
        let post = postReducer.posts.filter((post) => {
          console.log(post.userId.username, router.query.username);
          return post.userId?._id === authState.user.userId._id;
        });
        console.log(post);
        setuserPosts(post);
      }
    }
  }, [authState.user, postReducer.posts]);

  /* ================= UPDATE PROFILE PIC ================= */
  const updateprofilepicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));

    await clientServer.post("/update_profile_picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllUser());
  };

  /* ================= UPDATE PROFILE DATA ================= */
  const updateProfileData = async () => {
    await clientServer.post("/user_update", {
      token: localStorage.getItem("token"),
      name: userProfile?.userId?.name,
    });

    await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile?.bio,
      currentPost: userProfile?.currentPost,
      pastWork: userProfile?.pastWork,
      education: userProfile?.education,
    });

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  return (
    <Userlayout>
      <DashboardLayout>
        {authState.user && (
          <div className={styles.userProifileContainer}>
            <div className={styles.backDropContainer}>
              <label htmlFor="profilepictureuplaod" className={styles.backdrop}>
                <p>Edit</p>
              </label>

              <input
                hidden
                type="file"
                id="profilepictureuplaod"
                onChange={(e) => updateprofilepicture(e.target.files[0])}
              />

<img src={userProfile?.userId?.profilePicture} />
            </div>

            {/* ===== PROFILE DETAILS ===== */}
            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                {/* LEFT */}
                <div style={{ flex: "0.8" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      type="text"
                      className={styles.nameEdit}
                      value={userProfile?.userId?.name}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        })
                      }
                    />

                    <p style={{ color: "gray" }}>
                      @{userProfile?.userId?.username}
                    </p>
                  </div>

                  <div>
                    <textarea
                      value={userProfile?.bio}
                      onChange={(e) => {
                        setUserProfile({ ...userProfile, bio: e.target.value });
                      }}
                      rows={Math.max(
                        3,
                        Math.ceil(userProfile?.bio?.length / 80),
                      )}
                      className={styles.txtarea}
                    ></textarea>
                  </div>
                </div>

                {/* RIGHT */}
                <div style={{ flex: "0.2" }}>
                  <h3>Recent Activity</h3>

                  {userPosts?.map((post) => (
                    <div key={post._id} className={styles.postcard}>
                      <div className={styles.card}>
                        <div className={styles.card_profilecontainer}>
                          {post.media ? (
                            <img src={post.media} />
                          ) : (
                            <div
                              style={{ width: "3.4rem", height: "3.4rem" }}
                            />
                          )}
                        </div>
                        <p style={{ fontSize: "small" }}>{post?.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== WORK HISTORY ===== */}
            <div className="userWorkHistry">
              <h4>Work History</h4>

              <div className={styles.wrokhistorycontainer}>
                {userProfile?.pastWork?.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCArd}>
                      <p style={{ fontWeight: "bold" }}>
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years}</p>
                    </div>
                  );
                })}
                <button
                  onClick={() => setisModalopen(true)}
                  className={styles.addWorkbtn}
                >
                  Add work
                </button>
              </div>
            </div>

            <div className="userWorkHistry">
              <h4>Education</h4>

              <div className={styles.wrokhistorycontainer}>
                {userProfile?.education?.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCArd}>
                      <p style={{ fontWeight: "bold" }}>
                        {work.school} - {work.degree}
                      </p>
                      <p>{work.fieldOfStudy}</p>
                    </div>
                  );
                })}
                <button
                  onClick={() => setisModalopen2(true)}
                  className={styles.addWorkbtn}
                >
                  Add Education
                </button>
              </div>
            </div>

            {/* ===== UPDATE BUTTON ===== */}
            {userProfile != authState.user && (
              <button
                className={styles.connectionBtn}
                onClick={updateProfileData}
              >
                Update data
              </button>
            )}
          </div>
        )}

        {isModalopen && (
          <div
            onClick={() => {
              setisModalopen(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allcomments}
            >
              <input
                onChange={handleWorkInputWork}
                name="company"
                type="text"
                placeholder="Enter works place"
                className={styles.row1}
              />
              <input
                onChange={handleWorkInputWork}
                name="position"
                type="text"
                placeholder="Enter position"
                className={styles.row1}
              />
              <input
                onChange={handleWorkInputWork}
                name="years"
                type="number"
                placeholder="Enter no. of years you work"
                className={styles.row1}
              />

              <button
                className={styles.connetbtn}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    pastWork: [...(userProfile.pastWork || []), handlework],
                  });
                  setisModalopen(false);
                }}
              >
                {" "}
                Add work
              </button>
            </div>
          </div>
        )}

        {isModalopen2 && (
          <div
            onClick={() => {
              setisModalopen2(false);
            }}
            className={styles.commentsContainer}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={styles.allcomments}
            >
              <input
                onChange={handleEducationInput}
                name="school"
                type="text"
                placeholder="Enter School Name"
                className={styles.row1}
              />
              <input
                onChange={handleEducationInput}
                name="degree"
                type="text"
                placeholder="Enter degreen you pursued"
                className={styles.row1}
              />
              <input
                onChange={handleEducationInput}
                name="fieldOfStudy"
                type="text"
                placeholder="Enter the field you study in"
                className={styles.row1}
              />

              <button
                className={styles.connetbtn}
                onClick={() => {
                  setUserProfile({
                    ...userProfile,
                    education: [...(userProfile.education || []), edu],
                  });
                  setisModalopen2(false);
                }}
              >
                {" "}
                Add Education
              </button>
            </div>
          </div>
        )}
      </DashboardLayout>
    </Userlayout>
  );
}
