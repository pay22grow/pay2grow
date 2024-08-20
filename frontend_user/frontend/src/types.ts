export interface UserInfo {
    email: string;
    phoneNumber: string;
}

export interface Recharge {
    _id: string; 
    user_id: string; 
    userInfo: UserInfo;
    userDbId: string; 
    buyPoints: number;
    receivePoints: number;
    needToPayUSDT: number;
    profit: number;
    rechargeProof: string; 
    status: 'pending' | 'approved/waiting withdraw' | 'withdraw success' | 'rejected';
    createdAt: string; 
    updatedAt: string; 
    __v?: number;
    buyPrice?: number;
    sellPrice?: number;
}

export interface GetRechargesResponse {
    status: boolean; 
    message: string; 
    recharges?: Recharge[]; 
}
