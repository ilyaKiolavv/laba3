import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
    // Состояния значений полей
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    // Состояние ошибки валидации для каждого поля
    const [errors, setErrors] = useState({
        name: null,
        email: null,
        message: null,
    });

    // Состояние «тронутых» полей (чтобы не показывать ошибку до выхода из поля)
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        message: false,
    });

    // Состояния процесса и успешной отправки
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Функции валидации
    const validateName = (value) => {
        if (!value.trim()) return "Имя обязательно для заполнения";
        if (value.trim().length < 2) return "Минимум 2 символа";
        if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim()))
            return "Только буквы, пробелы и дефис";
        return null;
    };

    const validateEmail = (value) => {
        if (!value.trim()) return "Email обязателен для заполнения";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
            return "Некорректный формат email";
        return null;
    };

    const validateMessage = (value) => {
        if (!value.trim()) return "Сообщение обязательно для заполнения";
        if (value.trim().length < 10) return "Минимум 10 символов";
        return null;
    };

    const validators = {
        name: validateName,
        email: validateEmail,
        message: validateMessage,
    };

    // Обработчик изменения поля (live-валидация)
    const handleChange = (field, value) => {
        switch (field) {
            case "name":
                setName(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "message":
                setMessage(value);
                break;
        }

        if (touched[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: validators[field](value),
            }));
        }
    };

    // Обработчик потери фокуса (blur)
    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const currentValue =
            field === "name" ? name : field === "email" ? email : message;
        setErrors((prev) => ({
            ...prev,
            [field]: validators[field](currentValue),
        }));
    };

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            name: validateName(name),
            email: validateEmail(email),
            message: validateMessage(message),
        };

        setErrors(newErrors);
        setTouched({ name: true, email: true, message: true });

        if (Object.values(newErrors).some((err) => err !== null)) {
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    // Динамические классы для инпута
    const getInputClass = (field) => {
        const classes = ["field__input"];
        if (touched[field] && errors[field]) {
            classes.push("field__input--error");
        } else if (touched[field] && !errors[field]) {
            classes.push("field__input--valid");
        }
        if (field === "message") {
            classes.push("field__input--textarea");
        }
        return classes.join(" ");
    };

    // Условный рендеринг после успешной отправки
    if (submitted) {
        return (
            <div className="feedback-form feedback-form--success">
                <h2 className="feedback-form__title">Спасибо за обращение!</h2>
                <p className="feedback-form__text">
                    Мы свяжемся с вами в ближайшее время.
                </p>
                <button
                    type="button"
                    className="feedback-form__submit"
                    onClick={() => {
                        setName("");
                        setEmail("");
                        setMessage("");
                        setErrors({ name: null, email: null, message: null });
                        setTouched({ name: false, email: false, message: false });
                        setSubmitted(false);
                    }}
                >
                    Отправить ещё одно сообщение
                </button>
            </div>
        );
    }

    return (
        <form className="feedback-form" onSubmit={handleSubmit}>
            {/* Поле «Имя» */}
            <div className="field">
                <label htmlFor="name" className="field__label">
                    Имя
                </label>
                <input
                    id="name"
                    type="text"
                    className={getInputClass("name")}
                    value={name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                />
                {touched.name && errors.name && (
                    <span className="field__error">{errors.name}</span>
                )}
            </div>

            {/* Поле «Email» */}
            <div className="field">
                <label htmlFor="email" className="field__label">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    className={getInputClass("email")}
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                />
                {touched.email && errors.email && (
                    <span className="field__error">{errors.email}</span>
                )}
            </div>

            {/* Поле «Сообщение» */}
            <div className="field">
                <label htmlFor="message" className="field__label">
                    Сообщение
                </label>
                <textarea
                    id="message"
                    className={getInputClass("message")}
                    value={message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    rows={5}
                />
                {touched.message && errors.message && (
                    <span className="field__error">{errors.message}</span>
                )}
            </div>

            <button
                type="submit"
                className="feedback-form__submit"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Отправка…" : "Отправить"}
            </button>
        </form>
    );
}

export default FeedbackForm;