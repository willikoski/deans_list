import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from './ParentCreateForm.module.scss'; // Import your CSS module
import { getToken } from '../../utilities/users-service'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/api/users';

const ParentCreateForm = ({ user, setShowParentCreateForm }) => {
    const token = getToken()

    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();
    const campusNumRef = useRef();
    const roleRef = useRef(); // Ref for role input
    const errRef = useRef();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [campusNum, setCampusNum] = useState(`${user.campusNum}`);
    const [role, setRole] = useState('parent'); // State for role
    const [selectedStudents, setSelectedStudents] = useState([]); // State for selected students

    const [validFirstName, setValidFirstName] = useState(false);
    const [validLastName, setValidLastName] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validConfirmPassword, setValidConfirmPassword] = useState(false);
    const [validCampusNum, setValidCampusNum] = useState(true);
    const [validRole, setValidRole] = useState(true); // Always valid for hard-coded role
    const [validSelectedStudents, setValidSelectedStudents] = useState(true);

    const [firstNameFocus, setFirstNameFocus] = useState(false);
    const [lastNameFocus, setLastNameFocus] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        firstNameRef.current.focus();
    }, []);

    useEffect(() => {
        setValidFirstName(firstName.trim() !== '');
    }, [firstName]);

    useEffect(() => {
        setValidLastName(lastName.trim() !== '');
    }, [lastName]);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
    }, [password]);

    useEffect(() => {
        setValidConfirmPassword(confirmPassword === password);
    }, [confirmPassword, password]);

    useEffect(() => {
        setErrMsg('');
    }, [firstName, lastName, email, password, confirmPassword]);

    // Update the validSelectedStudents state based on whether at least one student is selected
    useEffect(() => {
        setValidSelectedStudents(selectedStudents.length > 0);
    }, [selectedStudents]);


    useEffect(() => {
        console.log('Selected Students:', selectedStudents);
    }, [selectedStudents]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validFirstName || !validLastName || !validEmail || !validPassword || !validConfirmPassword || !validSelectedStudents) {
            setErrMsg("Invalid Entry");
            return;
        }
        
        try {
            const response = await fetch(REGISTER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                    campusNum,
                    role, // Include role in the request body
                    students: [selectedStudents] // Include selected students in the request body
                })
            });
    
            if (!response.ok) {
                throw new Error('Registration Failed');
            }
    
            const responseData = await response.json();
    
            setSuccess(true);
            setShowParentCreateForm(false)

            console.log(user, user.students)
    
            // Clear form fields
            setFirstName('');
            setLastName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            // Role is hard-coded, no need to reset
        } catch (err) {
            console.error(err); // Log the error to the console
            setErrMsg(err.message || 'Registration Failed');
            errRef.current.focus();
        }
    };     
    
    const handleExit = async (e) => {
        e.preventDefault()
        setShowParentCreateForm(false)
    }

    return (
        <section className={styles.section}>
            {user ? <p>User Created!</p> : ''}
            <p ref={errRef} className={errMsg ? styles.errmsg : styles.offscreen} aria-live="assertive">{errMsg}</p>
            <h1>Register</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
                {/* First Name */}
                <div className={styles.nameContainer}>
                    <div className={styles.fName}>
                        <label htmlFor="firstName" className={styles.label}>
                            First Name:
                            <FontAwesomeIcon icon={faCheck} className={validFirstName ? styles.valid : styles.hide} />
                            <FontAwesomeIcon icon={faTimes} className={validFirstName || !firstName ? styles.hide : styles.invalid} />
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            ref={firstNameRef}
                            autoComplete="off"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                            aria-invalid={validFirstName ? "false" : "true"}
                            className={styles.input}
                            onFocus={() => setFirstNameFocus(true)}
                            onBlur={() => setFirstNameFocus(false)}
                        />
                    </div>
                    <div className={styles.lName}>
                        {/* Last Name */}
                        <label htmlFor="lastName" className={styles.label}>
                            Last Name:
                            <FontAwesomeIcon icon={faCheck} className={validLastName ? styles.valid : styles.hide} />
                            <FontAwesomeIcon icon={faTimes} className={validLastName || !lastName ? styles.hide : styles.invalid} />
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            ref={lastNameRef}
                            autoComplete="off"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            required
                            aria-invalid={validLastName ? "false" : "true"}
                            className={styles.input}
                            onFocus={() => setLastNameFocus(true)}
                            onBlur={() => setLastNameFocus(false)}
                        />
                    </div>
                </div>
                <div>
                    <p id="firstNameNote" className={firstNameFocus && !validFirstName ? styles.instructions : styles.offscreen}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Please enter your first name.
                    </p>
                    <p id="lastNameNote" className={lastNameFocus && !validLastName ? styles.instructions : styles.offscreen}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Please enter your last name.
                    </p>
                </div>

                <div className={styles.emailAndCampusContainer}>
                    <div className={styles.email}>
                        {/* Email */}
                        <label htmlFor="email" className={styles.label}>
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? styles.valid : styles.hide} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? styles.hide : styles.invalid} />
                        </label>
                        <input
                            type="email"
                            id="email"
                            ref={emailRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            className={styles.input}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                    </div>
                </div>
                <p id="emailNote" className={emailFocus && !validEmail ? styles.instructions : styles.offscreen}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please enter a valid email address.
                </p>
                <div className={styles.passwordContainer}>
                    <div className={styles.pwd}>
                        {/* Password */}
                        <label htmlFor="password" className={styles.label}>
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPassword ? styles.valid : styles.hide} />
                            <FontAwesomeIcon icon={faTimes} className={validPassword || !password ? styles.hide : styles.invalid} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            ref={passwordRef}
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            aria-invalid={validPassword ? "false" : "true"}
                            className={styles.input}
                            onFocus={() => setPasswordFocus(true)}
                            onBlur={() => setPasswordFocus(false)}
                        />
                    </div>
                    <div className={styles.confirmPwd}>
                        {/* Confirm Password */}
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={confirmPassword && validConfirmPassword ? styles.valid : styles.hide} />
                            <FontAwesomeIcon icon={faTimes} className={validConfirmPassword || !confirmPassword ? styles.hide : styles.invalid} />
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            ref={confirmPasswordRef}
                            autoComplete="off"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            required
                            aria-invalid={validConfirmPassword ? "false" : "true"}
                            className={styles.input}
                            onFocus={() => setConfirmPasswordFocus(true)}
                            onBlur={() => setConfirmPasswordFocus(false)}
                        />
                    </div>
                </div>
                <p id="passwordNote" className={passwordFocus && !validPassword ? styles.instructions : styles.offscreen}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Password must be 8 to 24 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
                </p>
                <p id="confirmPasswordNote" className={confirmPasswordFocus && !validConfirmPassword ? styles.instructions : styles.offscreen}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Please confirm your password.
                </p>
                <div className={styles.studentContainer}>
                    <label className={styles.label}>* Select Students:</label>
                    {user.students.map((student, index) => (
                        <div key={index}>
                            <input
                                type="checkbox"
                                id={`student_${index}`}
                                value={student._id}
                                onChange={(e) => {
                                    const studentId = e.target.value;
                                    setSelectedStudents(prevStudents => {
                                        if (e.target.checked) {
                                            return [...prevStudents, studentId];
                                        } else {
                                            return prevStudents.filter(id => id !== studentId);
                                        }
                                    });
                                }}
                            />
                            <label htmlFor={`student_${index}`}>{student.lastName}, {student.firstName}</label>
                        </div>
                    ))}
                </div>
                <button
                    disabled={!validFirstName || !validLastName || !validEmail || !validPassword || !validConfirmPassword || !validSelectedStudents }
                    className={(!validFirstName || !validLastName || !validEmail || !validPassword || !validConfirmPassword || !validSelectedStudents) ? styles.disabledButton : styles.button}
                >
                    Create Parent User
                </button>
            </form>
            <img onClick={handleExit} className={styles.closeBtn} src="/img/window-close.png" alt="window-close" />
        </section>
    );
}

export default ParentCreateForm;
