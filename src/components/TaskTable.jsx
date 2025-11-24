const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TaskTable({ tasks, onToggle, onDelete, onEdit }) {
  const handleEdit = (task) => {
    const newTitle = window.prompt("Editar tarefa", task.title);
    if (newTitle !== null) {
      const trimmed = newTitle.trim();
      if (trimmed && trimmed !== task.title) {
        onEdit(task.id, trimmed);
      }
    }
  };

  if (!tasks?.length) {
    return (
      <div className="task-table-wrapper">
        <div className="table-header">
          <h2>Visão em Tabela</h2>
          <span>0 tarefas</span>
        </div>
        <p className="empty">Nenhuma tarefa para listar.</p>
      </div>
    );
  }

  return (
    <div className="task-table-wrapper">
      <div className="table-header">
        <h2>Visão em Tabela</h2>
        <span>
          {tasks.length} {tasks.length === 1 ? "tarefa" : "tarefas"}
        </span>
      </div>

      <div className="table-scroll">
        <table className="task-table">
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Status</th>
              <th>Criada em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className={task.completed ? "completed-row" : ""}>
                <td className="task-table-title">{task.title}</td>
                <td>
                  <span
                    className={`status-badge ${
                      task.completed ? "completed" : "pending"
                    }`}
                  >
                    {task.completed ? "Concluída" : "Pendente"}
                  </span>
                </td>
                <td>{formatDate(task.createdAt)}</td>
                <td className="table-actions">
                  <button
                    type="button"
                    className="action-btn edit"
                    onClick={() => handleEdit(task)}
                  >
                    Atualizar
                  </button>
                  <button
                    type="button"
                    className={`action-btn toggle ${
                      task.completed ? "completed" : ""
                    }`}
                    onClick={() => onToggle(task.id)}
                  >
                    {task.completed ? "Reabrir" : "Marcar feita"}
                  </button>
                  <button
                    type="button"
                    className="action-btn delete"
                    onClick={() => onDelete(task.id)}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

