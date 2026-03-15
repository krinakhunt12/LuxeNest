import React, { useEffect, useState, useRef } from 'react';
import { adminService } from '../../services/adminService';
import { logger } from '../../utils/logger';
import Users from './Users';
import toast from 'react-hot-toast';

const UsersContainer: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
    
    // Use ref to track mounted state
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        fetchUsers();
        
        // Cleanup function
        return () => {
            isMountedRef.current = false;
        };
    }, []); // Empty dependency array - only run once

    const fetchUsers = async () => {
        if (!isMountedRef.current) return;
        
        try {
            logger.info('Fetching customer database...');
            setLoading(true);
            const data = await adminService.getUsers();
            
            // Only update state if component is still mounted
            if (isMountedRef.current) {
                setUsers(data);
                logger.debug('Customer data synchronized', { count: data.length });
            }
        } catch (error: any) {
            if (isMountedRef.current) {
                logger.error('Failed to load customers', { error });
                toast.error('Failed to load customers');
                setUsers([]);
            }
        } finally {
            if (isMountedRef.current) {
                setLoading(false);
            }
        }
    };

    // Add debounced refresh to prevent multiple rapid calls
    const [refreshCount, setRefreshCount] = useState(0);
    const debouncedRefresh = () => {
        setRefreshCount(prev => prev + 1);
        setTimeout(() => {
            setRefreshCount(prev => Math.max(0, prev - 1));
        }, 1000);
        fetchUsers();
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
            onRefresh={debouncedRefresh}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
        />
    );
};

export default UsersContainer;
