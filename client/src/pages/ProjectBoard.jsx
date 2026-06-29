import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import BoardColumn from "../components/BoardColumn.jsx";

const ProjectBoard = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        const projectId = await API.get(`/projects/${id}`);
        setProject(projectId.data);
        console.log(projectId.data);

        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading..</div>
      ) : (
        <div>
          <h1>{project.name}</h1>
          <div className="flex">
            {project?.boards?.map((board) => (
              <div key={board.id}>
                <BoardColumn board={board} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
