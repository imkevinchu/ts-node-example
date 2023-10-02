import express from 'express';

import { deleteUser, getAllUsers, updateUser } from '../controllers/users';
import { isAuthenticated, isOwner } from '../middleware';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, getAllUsers)
    router.delete('/users', isAuthenticated, isOwner, deleteUser)
    router.patch('/users', isAuthenticated, isOwner, updateUser)
}