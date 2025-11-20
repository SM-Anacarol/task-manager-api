import { useState } from "react";
import editarIcon from "../../img/editar.png";
import lixeiraIcon from "../../img/lixeira.png";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = () => {
    if (isEditing) {
      if (editTitle.trim() && editTitle.trim() !== task.title) {
        onEdit(task.id, editTitle.trim());
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-content">
        <div className="task-main">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyPress}
              onBlur={handleEdit}
              className="edit-input"
              autoFocus
            />
          ) : (
            <span 
              onClick={() => onToggle(task.id)} 
              className="task-title"
              title="Clique para marcar como concluída"
            >
              {task.title}
            </span>
          )}
        </div>
        {task.createdAt && (
          <div className="task-date">
            Criada em: {formatDate(task.createdAt)}
          </div>
        )}
      </div>
      <div className="task-actions">
        <button 
          onClick={handleEdit} 
          className="edit-btn icon-btn"
          title={isEditing ? "Salvar" : "Editar"}
        >
          {isEditing ? "✓" : <img src={editarIcon} alt="Editar" />}
        </button>
        <button 
          onClick={() => onDelete(task.id)} 
          className="delete-btn icon-btn"
          title="Deletar tarefa"
        >
          <img src={lixeiraIcon} alt="Excluir" />
        </button>
      </div>
    </div>
  );
}
