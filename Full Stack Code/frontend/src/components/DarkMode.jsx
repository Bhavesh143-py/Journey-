import { useDarkMode } from "./tokencontext";
const DarkModeButton = () => {
    const { darkMode, setDarkMode } = useDarkMode();
    const handleMode = () => {
        setDarkMode((prev) => !prev);
    };

    return (
        <span
            onClick={handleMode}
            className="fixed top-2 left-3 z-50 text-2xl cursor-pointer h-5 w-5"
        >
            {darkMode ? "🌞" : "🌚"}
        </span>
    );
};

export default DarkModeButton;
