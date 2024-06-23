import styles from "./Button.module.css";

const Button: React.FC<React.PropsWithChildren<{
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type: string;
}>> = ({onClick, type, children}) => {
  return (<button onClick={onClick} className={`${styles.btn}  ${styles[type]}`}>
    {children}
  </button>)
};

export default Button;
