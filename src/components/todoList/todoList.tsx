import { useCallback, useRef, useState } from "react";
import { Button } from "../button";
import { Section } from "../section";
import { useTodoList } from "../storage/todo-list";
import STYLES from "./todoList.module.css";
import { MultiStateCheckbox } from "../multiStateCheckbox";
import classNames from "classnames";

type TodoListItemProps = { id: string };

const TodoListItem = ({ id }: TodoListItemProps) => {
  const { items, editItem, setItemCompleted, removeItem } = useTodoList();

  const item = items.find((item) => item.id === id);

  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = useCallback(() => {
    if (editInputRef.current) {
      const newTitle = editInputRef.current.value.trim();
      editItem(id, newTitle);
    }
    setIsEditing(false);
  }, [editItem, setIsEditing]);

  if (!item) return null;

  return (
    <div
      className={classNames(STYLES.item, {
        [STYLES.completed]: item.completed,
      })}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isEditing ? (
        <>
          <input
            className={STYLES.title}
            type="text"
            defaultValue={item.title}
            ref={editInputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEdit();
              }
            }}
          />
          <div className={STYLES.actions}>
            <Button small bold onClick={handleEdit}>
              ✓
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className={STYLES.title}>{item.title}</span>
          {showActions ? (
            <div className={STYLES.actions}>
              <Button small bold onClick={() => setIsEditing(true)}>
                E
              </Button>
              <Button
                small
                bold
                onClick={() => removeItem(id)}
                requireConfirmation
                confirmationText="C"
              >
                X
              </Button>
            </div>
          ) : null}
          <MultiStateCheckbox
            states={[undefined, "checked"]}
            value={item.completed ? "checked" : undefined}
            onChange={(newValue) =>
              setItemCompleted(id, newValue === "checked")
            }
          />
        </>
      )}
    </div>
  );
};

type TodoListProps = {};

export const TodoList = ({}: TodoListProps) => {
  const { items, addItem } = useTodoList();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTodo = useCallback(() => {
    if (inputRef.current) {
      const newTodo = inputRef.current.value.trim();
      if (newTodo) {
        addItem(newTodo);
        inputRef.current.value = "";
      }
    }
  }, [addItem]);

  return (
    <Section title="Todo List" classNames={[STYLES.TodoList]}>
      {[
        <div className={STYLES.add}>
          <input
            type="text"
            placeholder="New todo item..."
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
          />
          <Button small bold onClick={handleAddTodo}>
            Add
          </Button>
        </div>,
        ...items.map(({ id }) => <TodoListItem key={id} id={id} />),
      ]}
    </Section>
  );
};
