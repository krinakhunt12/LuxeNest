import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { logger } from '../../utils/logger';
import Users from './Users';
import toast from 'react-hot-toast';

const UsersContainer: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            logger.info('Fetching customer database...');
            setLoading(true);
            const data = await adminService.getUsers();
            setUsers(data);
            logger.debug('Customer data synchronized', { count: data.length });
        } catch (error) {
            logger.error('Failed to load customers', { error });
            toast.error('Failed to load customers');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           u.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <Users
            users={filteredUsers}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={fetchUsers}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
        />
    );
};

export default UsersContainer;
