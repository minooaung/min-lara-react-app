import { useEffect, useState } from "react"
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const {setNotification} = useStateContext();

    //-----------------
    const [paginationLinks, setPaginationLinks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    //const [lastPage, setLastPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0); // State to hold the total number of users
    const [fromUser, setFromUser] = useState(0); // Starting user number on the current page
    const [toUser, setToUser] = useState(0); // Ending user number on the current page
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async (page = 1) => {
        try {
            setLoading(true)
            const response = await axiosClient.get('/users', {
                params: {
                    page,
                    search: searchQuery
                }
            });

            setUsers(response.data.data);
            setPaginationLinks(response.data.links);
            setCurrentPage(response.data.current_page);
            //setLastPage(response.data.last_page);
            setTotalUsers(response.data.total);
            setFromUser(response.data.from);
            setToUser(response.data.to);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, searchQuery]);

    const handlePageChange = (url) => {
        if (url) {
            const page = new URL(url).searchParams.get('page');
            setCurrentPage(Number(page));
        }
    };
    //-----------------

    const onDelete = (u) => {
        if (!window.confirm(`Are you sure you want to delete [${u.name}]?`)) {
            return
        }

        axiosClient.delete(`/users/${u.id}`)
            .then(() => {
                setNotification('User was successfully deleted')

                fetchUsers(1);
            })
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Users</h1>
                <Link to="/users/new" className="btn-add">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <input type="text"
                       className="search-filter-field"
                       placeholder="Search"
                       onChange={(e) => setSearchQuery(e.target.value)}
                />

                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    {loading && 
                        <tbody>
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <Link className="btn-edit" to={'/users/'+u.id}>Edit</Link>
                                        &nbsp;
                                        <button onClick={ev => onDelete(u)} className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    }
                </table>
                <div className="pagination-container">
                    <div>Showing {fromUser} to {toUser} of {totalUsers} users</div>
                    <div className="pagination">
                        {paginationLinks.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(link.url)}
                                disabled={!link.url || link.active}
                                style={{ margin: '0 5px', fontWeight: link.active ? 'bold' : 'normal' }}
                            >
                                {link.label.replace(/&laquo;|&raquo;/g, '')}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}