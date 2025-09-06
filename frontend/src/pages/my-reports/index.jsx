import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const MyReportsPage = () => {
    const { user, loading } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            if (user) {
                try {
                    const response = await api.get('/users/me/issues');
                    setReports(response.data);
                } catch (err) {
                    setError('Failed to fetch reports.');
                    console.error(err);
                }
            }
        };

        if (!loading) {
            fetchReports();
        }
    }, [user, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

        if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">My Reported Issues</h1>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue Type</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Reported</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id}>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{report.issue_type}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{report.status}</td>
                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(report.detected_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyReportsPage;
