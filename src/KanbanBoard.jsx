
//without date ;2.55pm :add ticket button working properly
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const KanbanBoard = () => {
    const [backlog, setBacklog] = useState([]);
    const [inProgress, setInProgress] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [newTicket, setNewTicket] = useState("");

    // Load state from localStorage when component mounts
    useEffect(() => {
      const storedBacklog = JSON.parse(localStorage.getItem('backlog')) || [];
      const storedInProgress = JSON.parse(localStorage.getItem('inProgress')) || [];
      const storedCompleted = JSON.parse(localStorage.getItem('completed')) || [];
      
      setBacklog(storedBacklog);
      setInProgress(storedInProgress);
      setCompleted(storedCompleted);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
      localStorage.setItem('backlog', JSON.stringify(backlog));
      localStorage.setItem('inProgress', JSON.stringify(inProgress));
      localStorage.setItem('completed', JSON.stringify(completed));
  }, [backlog, inProgress, completed]);


    // Fetch tickets
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

    // Add new ticket
    const handleAddTicket = async () => {
      if (newTicket.trim() !== "") {
          const ticket = { text: newTicket, status: "Backlog" };
  
          try {
              // POST the new ticket to the backend
              const response = await axios.post("http://localhost:5000/tickets", ticket);
              console.log("Ticket added successfully:", response.data);
  
              // Add the new ticket to the backlog state
              setBacklog((prevBacklog) => [...prevBacklog, { ...ticket, id: response.data.id }]);
              setNewTicket(""); // Clear the input field
          } catch (error) {
              console.error("Error adding ticket:", error.response?.data || error.message);
          }
      } else {
          alert("Please enter a valid ticket!");
      }
  };


    // Handle drag and drop
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

// Column Component
const Column = ({ title, tasks, onDrop }) => {
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
                    onDragStart={(e) => {
                        e.dataTransfer.setData("task", JSON.stringify(task));
                        e.dataTransfer.setData("sourceColumn", title);
                    }}
                >
                    <p>{task.text}</p>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;






/*
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
*/
