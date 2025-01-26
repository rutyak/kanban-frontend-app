import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Base_url = process.env.REACT_APP_BACKEND_URL;

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const [activeSection, setActiveSection] = useState<string>("account");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [dob, setDob] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const { userData } = useAuth(); 

  useEffect(() => {
    // if (userData) {
    //   setUsername(userData?.username || "");
    //   setEmail(userData?.email || "");
    //   setDob(userData?.dob || "");
    //   setAddress(userData?.address || "");
    // }
  }, [userData]);

  const handleSave = async () => {
    // const updatedProfile = { username, email, dob, address };
    // try {
    //   await axios.patch(`${Base_url}/profile/${userData?._id}`, updatedProfile);
    //   toast.success("Profile updated successfully!");
    // } catch (error) {
    //   console.error("Error updating profile:", error);
    //   toast.error("Failed to update profile. Please try again later.");
    // }
  };

  return (
    <div className="profile-container">
      <div className="header">
        <div className="avatar-container">
          <img
            src="/static/images/avatar/1.jpg"
            alt="User Profile"
            className="avatar"
          />
          <div className="username">Rutik</div>
        </div>
      </div>

      <div className="flex-container">
        <div className="sidebar">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">Account Options</h3>
          <button
            className={`sidebar-button ${activeSection === "account" ? "sidebar-button-active" : ""}`}
            onClick={() => setActiveSection("account")}
          >
            Account Details
          </button>
          <button
            className={`sidebar-button ${activeSection === "blog" ? "sidebar-button-active" : ""}`}
            onClick={() => setActiveSection("blog")}
          >
            Blog Posts
          </button>
        </div>

        <div className="content-container">
          {activeSection === "account" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Account Details</h3>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <div className="form-control">
                  <input
                    className="input-field"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="form-control">
                  <input
                    className="input-field"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-control">
                  <input
                    className="input-field"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
                <div className="form-control">
                  <input
                    className="input-field"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    required
                  />
                </div>
                <div className="form-control">
                  <button type="submit" className="button-save">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* {activeSection === "blog" && <BlogPosts editMode={true} />} */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
