import { useEffect, useState } from "react";
import API from "../api/axios.js";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const enterProject = (id) => {
    return navigate("/projects/" + id);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const project = await API.get("/projects");
        // console.log(project.data);
        setProjects(project.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "" || description === "") {
      console.log("Input projct details");
    }

    try {
      const newProject = await API.post("/projects", { name, description });
      setProjects([...projects, newProject.data]);
      setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="head flex justify-between">
        <h1>Dashboard</h1>
        <button onClick={() => setShowForm(true)}>New project</button>
      </div>
      {showForm && (
        <form action="" onSubmit={handleSubmit}>
          <div className="form">
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Submit</button>
          </div>
        </form>
      )}

      <div className="project flex gap-5 my-10 p-5">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => enterProject(project.id)}
            className="card border border-b-black p-5"
          >
            <div className="name">{project.name}</div>
            <div className="description">{project.description}</div>
            <div className="members">{project._count.memberships}</div>
            <div className="role">{project.memberships[0].role}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
