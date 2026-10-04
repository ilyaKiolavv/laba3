import { useState } from "react";
import "./FeedbackForm.css";

function FeedbackForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [wantsReply, setWantsReply] = useState(false);

    const [errors, setErrors] = useState({
        name: null,
        phone: null,
        email: null,
        message: null,
    });

    const [touched, setTouched] = useState({
        name: false,
        phone: false,
        email: false,
        message: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validateName = (value) => {
        if (!value.trim()) return "Обязательное поле";
        if (value.trim().length < 2) return "Минимум 2 символа";
        if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim()))
            return "Только буквы, пробелы и дефис";
        return null;
    };

    const validatePhone = (value) => {
        const digits = value.replace(/\D/g, "");
        if (!value.trim()) return "Обязательное поле";
        if (digits.length !== 11) return "Некорректный формат (нужно 11 цифр)";
        return null;
    };

    const validateEmail = (value, isReplyRequired = wantsReply) => {
        if (isReplyRequired && !value.trim()) return "Укажите email для ответа";
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
            return "Некорректный формат email";
        return null;
    };

    const validateMessage = (value) => {
        if (!value.trim()) return "Обязательное поле";
        if (value.trim().length < 10) return "Минимум 10 символов";
        if (value.length > 500) return "Максимум 500 символов";
        return null;
    };

    const validators = {
        name: validateName,
        phone: validatePhone,
        message: validateMessage,
    };

    const formatPhone = (val) => {
        const digits = val.replace(/\D/g, "");
        if (!digits) return "";

        let raw = digits;
        if (['7', '8'].includes(raw[0])) raw = raw.substring(1);

        let out = "+7";
        if (raw.length > 0) out += ` (${raw.substring(0, 3)}`;
        if (raw.length >= 4) out += `) ${raw.substring(3, 6)}`;
        if (raw.length >= 7) out += `-${raw.substring(6, 8)}`;
        if (raw.length >= 9) out += `-${raw.substring(8, 10)}`;

        return out;
    };

    const handleChange = (field, value) => {
        let newValue = value;
        if (field === "phone") newValue = formatPhone(value);

        switch (field) {
            case "name": setName(newValue); break;
            case "email": setEmail(newValue); break;
            case "phone": setPhone(newValue); break;
            case "message": setMessage(newValue); break;
            default: break;
        }

        if (touched[field]) {
            const error = field === "email"
                ? validateEmail(newValue, wantsReply)
                : validators[field](newValue);
            setErrors((prev) => ({ ...prev, [field]: error }));
        }
    };

    const handleWantsReplyChange = (e) => {
        const checked = e.target.checked;
        setWantsReply(checked);
        if (touched.email) {
            setErrors((prev) => ({ ...prev, email: validateEmail(email, checked) }));
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));

        let currentValue = "";
        if (field === "name") currentValue = name;
        if (field === "email") currentValue = email;
        if (field === "phone") currentValue = phone;
        if (field === "message") currentValue = message;

        const error = field === "email"
            ? validateEmail(currentValue, wantsReply)
            : validators[field](currentValue);

        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            name: validateName(name),
            email: validateEmail(email, wantsReply),
            phone: validatePhone(phone),
            message: validateMessage(message),
        };

        setErrors(newErrors);
        setTouched({ name: true, email: true, phone: true, message: true });

        if (Object.values(newErrors).some((err) => err !== null)) return;

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
        }, 1500);
    };

    const getInputClass = (field) => {
        const classes = ["field__input"];
        if (touched[field] && errors[field]) classes.push("field__input--error");
        else if (touched[field] && !errors[field]) classes.push("field__input--valid");
        if (field === "message") classes.push("field__input--textarea");
        return classes.join(" ");
    };

    if (submitted) {
        return (
            <div className="feedback-form feedback-form--success">
                <h2 className="feedback-form__title">Спасибо за обращение!</h2>
                <p className="feedback-form__text">Мы свяжемся с вами в ближайшее время.</p>
                <button
                    type="button"
                    className="feedback-form__submit"
                    onClick={() => {
                        setName(""); setEmail(""); setPhone(""); setMessage(""); setWantsReply(false);
                        setErrors({ name: null, email: null, phone: null, message: null });
                        setTouched({ name: false, email: false, phone: false, message: false });
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
            <div className="field">
                <label htmlFor="name" className="field__label">Имя</label>
                <input
                    id="name"
                    type="text"
                    className={getInputClass("name")}
                    value={name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                />
                {touched.name && errors.name && <span className="field__error">{errors.name}</span>}
            </div>

            <div className="field">
                <label htmlFor="phone" className="field__label">Телефон</label>
                <input
                    id="phone"
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className={getInputClass("phone")}
                    value={phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                />
                {touched.phone && errors.phone && <span className="field__error">{errors.phone}</span>}
            </div>

            <div className="field">
                <label htmlFor="email" className="field__label">Email</label>
                <input
                    id="email"
                    type="email"
                    className={getInputClass("email")}
                    value={email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                />
                {touched.email && errors.email && <span className="field__error">{errors.email}</span>}
            </div>

            <div className="field-checkbox">
                <label>
                    <input
                        type="checkbox"
                        checked={wantsReply}
                        onChange={handleWantsReplyChange}
                    />
                    Хочу получить ответ
                </label>
            </div>

            <div className="field">
                <label htmlFor="message" className="field__label">Сообщение</label>
                <textarea
                    id="message"
                    className={getInputClass("message")}
                    value={message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    onBlur={() => handleBlur("message")}
                    rows={5}
                    maxLength={500}
                />
                <div className="field__counter">
                    <span style={{ color: message.length >= 500 ? '#e5484d' : '#667085' }}>
                        {message.length}
                    </span> / 500
                </div>
                {touched.message && errors.message && <span className="field__error">{errors.message}</span>}
            </div>

            <button type="submit" className="feedback-form__submit" disabled={isSubmitting}>
                {isSubmitting ? "Отправка…" : "Отправить"}
            </button>
        </form>
    );
}

export default FeedbackForm;