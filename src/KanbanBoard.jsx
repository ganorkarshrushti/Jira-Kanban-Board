/*  1:    import React, { useState } from "react";
import "./App.css";
import axios from "axios";

const KanbanBoard = () => {
  const [backlog, setBacklog] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [newTicket, setNewTicket] = useState("");

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2); // Extract last two digits of the year
    return  `${year}/${month}/${year}`;
  };

  const handleAddTicket = () => {
    if (newTicket.trim() !== "") {
      const ticket = {
        text: newTicket,
        date: formatDate(new Date()), // Use formatted date
      };
      setBacklog([...backlog, ticket]);
      setNewTicket("");
    }
  };

  const handleDragStart = (e, task, sourceColumn) => {
    e.dataTransfer.setData("task", JSON.stringify(task));
    e.dataTransfer.setData("sourceColumn", sourceColumn);
  };

  const handleDrop = (e, targetColumn) => {
    const task = JSON.parse(e.dataTransfer.getData("task"));
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (targetColumn !== sourceColumn) {
      switch (targetColumn) {
        case "Backlog":
          setBacklog([...backlog, task]);
          break;
        case "InProgress":
          setInProgress([...inProgress, task]);
          break;
        case "Completed":
          setCompleted([...completed, task]);
          break;
        default:
          break;
      }

      switch (sourceColumn) {
        case "Backlog":
          setBacklog(backlog.filter((t) => t.text !== task.text));
          break;
        case "InProgress":
          setInProgress(inProgress.filter((t) => t.text !== task.text));
          break;
        case "Completed":
          setCompleted(completed.filter((t) => t.text !== task.text));
          break;
        default:
          break;
      }
    }
  };

  const handleDelete = (task, column) => {
    switch (column) {
      case "Backlog":
        setBacklog(backlog.filter((t) => t.text !== task.text));
        break;
      case "InProgress":
        setInProgress(inProgress.filter((t) => t.text !== task.text));
        break;
      case "Completed":
        setCompleted(completed.filter((t) => t.text !== task.text));
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="add-ticket">
        <input
          type="text"
          value={newTicket}
          onChange={(e) => setNewTicket(e.target.value)}
          placeholder="Enter new ticket"
        />
        <button onClick={handleAddTicket}>Add Ticket</button>
      </div>

      <div className="kanban-board">
        <Column
          title="Backlog"
          tasks={backlog}
          onDrop={(e) => handleDrop(e, "Backlog")}
          onDragStart={handleDragStart}
          onDelete={handleDelete}
        />
        <Column
          title="InProgress"
          tasks={inProgress}
          onDrop={(e) => handleDrop(e, "InProgress")}
          onDragStart={handleDragStart}
          onDelete={handleDelete}
        />
        <Column
          title="Completed"
          tasks={completed}
          onDrop={(e) => handleDrop(e, "Completed")}
          onDragStart={handleDragStart}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default KanbanBoard;

const Column = ({ title, tasks, onDrop, onDragStart, onDelete }) => {
  return (
    <div
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <h3>{title}</h3>
      {tasks.map((task, index) => (
        <div
          key={index}
          className="task"
          draggable
          onDragStart={(e) => onDragStart(e, task, title)}
        >
          <div>
            <p>{task.text}</p>
            <small>{task.date}</small>
          </div>
          <button
            className="delete-button"
            onClick={() => onDelete(task, title)}
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};
*/


//backend connected one ....  also 12.36
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const KanbanBoard = () => {
  const [backlog, setBacklog] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [newTicket, setNewTicket] = useState("");

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${year}/${month}/${day}`;
  };

  // Fetch tickets from the database
  /*useEffect(() => {
    axios.get("http://localhost:5000/api/tasks/all").then((response) => {
      const tasks = response.data;
      setBacklog(tasks.filter((task) => task.column === "Backlog"));
      setInProgress(tasks.filter((task) => task.column === "InProgress"));
      setCompleted(tasks.filter((task) => task.column === "Completed"));
    });
  }, []);*/
  useEffect(() => {
    const fetchTickets = async () => {
        try {
            const response = await axios.get("http://localhost:5000/tickets");
            const tickets = response.data;
            setBacklog(tickets.filter((t) => t.status === "Backlog"));
            setInProgress(tickets.filter((t) => t.status === "InProgress"));
            setCompleted(tickets.filter((t) => t.status === "Completed"));
        } catch (error) {
            console.error("Error fetching tickets:", error);
        }
    };
    fetchTickets();
}, []);


  /*const handleAddTicket = () => {
    if (newTicket.trim() !== "") {
      const ticket = {
        text: newTicket,
        date: formatDate(new Date()),
        column: "Backlog",
      };
      axios.post("http://localhost:5000/api/tasks/add", ticket).then(() => {
        setBacklog([...backlog, ticket]);
        setNewTicket("");
      });
    }
  };*/
  const handleAddTicket = async () => {
    if (newTicket.trim() !== "") {
        const ticket = {
            text: newTicket,
            date: formatDate(new Date()),
            status: "Backlog",
        };

        try {
            await axios.post("http://localhost:5000/tickets", ticket);
            setBacklog([...backlog, ticket]);
            setNewTicket("");
        } catch (error) {
            console.error("Error adding ticket:", error);
        }
    }
};



  /*const handleDrop = (e, targetColumn) => {
    const task = JSON.parse(e.dataTransfer.getData("task"));
    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (targetColumn !== sourceColumn) {
      axios
        .put("http://localhost:5000/api/tasks/update", {
          id: task.id,
          column: targetColumn,
        })
        .then(() => {
          switch (targetColumn) {
            case "Backlog":
              setBacklog([...backlog, { ...task, column: targetColumn }]);
              break;
            case "InProgress":
              setInProgress([...inProgress, { ...task, column: targetColumn }]);
              break;
            case "Completed":
              setCompleted([...completed, { ...task, column: targetColumn }]);
              break;
            default:
              break;
          }

          switch (sourceColumn) {
            case "Backlog":
              setBacklog(backlog.filter((t) => t.id !== task.id));
              break;
            case "InProgress":
              setInProgress(inProgress.filter((t) => t.id !== task.id));
              break;
            case "Completed":
              setCompleted(completed.filter((t) => t.id !== task.id));
              break;
            default:
              break;
          }
        });
    }
  };*/
  const handleDrop = async (e, targetColumn) => {
    const taskData = e.dataTransfer.getData("task");

    if (!taskData) {
        console.error("No task data found in drag event.");
        return;
    }

    let task;
    try {
        task = JSON.parse(taskData);
    } catch (error) {
        console.error("Error parsing task data:", error);
        return;
    }

    const sourceColumn = e.dataTransfer.getData("sourceColumn");

    if (targetColumn !== sourceColumn) {
        try {
            await axios.put(`http://localhost:5000/tickets/${task.id}`, {
                status: targetColumn,
            });

            if (targetColumn === "Backlog") setBacklog([...backlog, task]);
            if (targetColumn === "InProgress") setInProgress([...inProgress, task]);
            if (targetColumn === "Completed") setCompleted([...completed, task]);

            if (sourceColumn === "Backlog") setBacklog(backlog.filter((t) => t.id !== task.id));
            if (sourceColumn === "InProgress") setInProgress(inProgress.filter((t) => t.id !== task.id));
            if (sourceColumn === "Completed") setCompleted(completed.filter((t) => t.id !== task.id));
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    }
};



  return (
    <>
      <div className="add-ticket">
        <input
          type="text"
          value={newTicket}
          onChange={(e) => setNewTicket(e.target.value)}
          placeholder="Enter new ticket"
        />
        <button onClick={handleAddTicket}>Add Ticket</button>
      </div>

      <div className="kanban-board">
        <Column
          title="Backlog"
          tasks={backlog}
          onDrop={(e) => handleDrop(e, "Backlog")}
        />
        <Column
          title="InProgress"
          tasks={inProgress}
          onDrop={(e) => handleDrop(e, "InProgress")}
        />
        <Column
          title="Completed"
          tasks={completed}
          onDrop={(e) => handleDrop(e, "Completed")}
        />
      </div>
    </>
  );
};

export default KanbanBoard;

/*const Column = ({ title, tasks, onDrop }) => {
  return (
    <div className="column" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <h3>{title}</h3>
      {tasks.map((task, index) => (
        <div key={index} className="task" draggable>
          <div>
            <p>{task.text}</p>
            <small>{task.date}</small>
          </div>
        </div>
      ))}
    </div>
  );
};*/



const Column = ({ title, tasks, onDrop }) => {
  return (
      <div className="column" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
          <h3>{title}</h3>
          {tasks.map((task, index) => (
              <div
                  key={index}
                  className="task"
                  draggable
                  onDragStart={(e) => {
                      e.dataTransfer.setData("task", JSON.stringify(task));
                      e.dataTransfer.setData("sourceColumn", title);
                  }}
              >
                  <div>
                      <p>{task.text}</p>
                      <small>{task.date}</small>
                  </div>
              </div>
          ))}
      </div>
  );
};






//serching prec