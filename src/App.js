import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [courses, setCourses] = useState([]);
  const [isEdit, setIsEdit] = useState(-1);
  const handleEdit = (id) => {
    let result = courses[id];
    setUpdateCourse(result);
    setIsEdit(id);
  };
  const handleUpdate = async () => {
    const { content, due_date, status, name, id } = updateCourse;
    let result = { content, due_date, status, name, id };
    console.log(result);
    await fetch(`http://localhost:3456/api/v1/courses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        due_date,
        status,
        name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        loadData();
      })
      .catch((err) => console.log(err));
    setIsEdit(-1);
  };
  const loadData = () => {
    fetch("http://localhost:3456/api/v1/courses")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setCourses(data.courses);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    loadData();
  }, []);
  const initial = { content: "", due_date: undefined, status: "", name: "" };
  const [newCourse, setNewCourse] = useState(initial);
  //   const [coursePost, setCoursePost] = useState({});
  const handleinputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(newCourse);
    const { content, due_date, status, name } = newCourse;
    fetch("http://localhost:3456/api/v1/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        due_date,
        status,
        name,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        loadData();
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    console.log(id);
    fetch(`http://localhost:3456/api/v1/courses/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        loadData();
      })
      .catch((err) => console.log(err));
  };

  const [updateCourse, setUpdateCourse] = useState({});
  const updateChange = (e) => {
    const { name, value } = e.target;
    setUpdateCourse((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="container-fluid">
        <div className="input">
          <span>@</span>
          <input
            name="content"
            value={newCourse.content}
            type="text"
            placeholder="course"
            onChange={(e) => handleinputChange(e)}
          />
        </div>
        <div className="input">
          <span>@</span>
          <input
            type="date"
            name="due_date"
            value={newCourse.due_date?.split("T")[0]}
            onChange={(e) => handleinputChange(e)}
          />
        </div>
        <div className="input">
          <span>@</span>
          <select
            name="status"
            value={newCourse.status}
            onChange={(e) => handleinputChange(e)}
          >
            <option value=""></option>
            <option value="pedding">pedding</option>
            <option value="fullfil">fullfil</option>
            <option value="reject">reject</option>
          </select>
        </div>
        <div className="input">
          <span>@</span>
          <input
            type="text"
            name="name"
            value={newCourse.name}
            placeholder="User name"
            onChange={(e) => handleinputChange(e)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <div>
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Content</th>
              <th scope="col">Due date</th>
              <th scope="col">Status</th>
              <th scope="col">Asighn to</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses?.map((course, i) => (
              <>
                {i === isEdit ? (
                  <>
                    <tr>
                      <th scope="row" key={i}>
                        {i + 1}
                      </th>
                      <td>
                        <input
                          onChange={updateChange}
                          type="text"
                          name="content"
                          value={updateCourse.content}
                          placeholder="course"
                        />
                      </td>
                      <td>
                        <input
                          onChange={updateChange}
                          type="date"
                          name="due_date"
                          value={updateCourse.due_date?.split("T")[0]}
                        />
                      </td>
                      <td>
                        <select
                          name="status"
                          value={updateCourse.status}
                          onChange={updateChange}
                        >
                          <option value=""></option>
                          <option value="pedding">pedding</option>
                          <option value="fullfil">fullfil</option>
                          <option value="reject">reject</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={updateCourse.name}
                          onChange={updateChange}
                          placeholder="User name"
                        />
                      </td>
                      <td>
                        <button
                          onClick={() => handleUpdate()}
                          className="btn btn-info"
                        >
                          Update
                        </button>
                        <button className="btn btn-danger">Delete</button>
                      </td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <th scope="row" key={i}>
                        {i + 1}
                      </th>
                      <td>{course.content}</td>
                      <td>{course.due_date?.split("T")[0]}</td>
                      <td>{course.status}</td>
                      <td>{course.name}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(i)}
                          className="btn btn-info"
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(course.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
