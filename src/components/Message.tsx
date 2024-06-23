import styles from "./Message.module.css";

const Message: React.FC<{message: string}> = ({ message }) => {
  return (
    <p className={styles.message}>
      <span role="img">👋</span> {message}
    </p>
  );
}

export default Message;
