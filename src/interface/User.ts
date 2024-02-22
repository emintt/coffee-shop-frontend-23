interface User {
    user_id: number;
    user_level_id: number;
}

interface LoginUser {
    message: string;
    token: string;
    user: User;
}
