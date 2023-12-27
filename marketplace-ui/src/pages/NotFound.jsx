import { Outlet } from 'react-router-dom';

function NotFound() {
    return (
        <div>
            <h1>404 Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Outlet />
        </div>
    );
}

export default NotFound;