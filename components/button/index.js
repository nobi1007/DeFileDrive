import styles from "./button.module.css";

export default function Button({ variant = "primary", onPress, label }) {
    return (
        <button
            className={`${styles["button-base"]} ${
                styles[`button-${variant}`]
            }`}
            onClick={onPress}
        >
            {label}
        </button>
    );
}
