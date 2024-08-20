export interface UserInfo {
    name: string | '';
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
    status: string;
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

export interface BankDetails {
    accNo?: number;
    ifscCode?: string;
    branch?: string;
    payeeName?: string;
}

export interface User {
    name: string;
    status: string;
    phoneNumber: string;
    email: string;
    kyc: string;
    balance: number;
    pending: number;
    kycVerified: string;
    bankDetails: BankDetails;
    uniqueInvitationCode: string;
    bankUpdateRequest: string;
    _id: string;
}

export interface UsersResponse {
    success: boolean;
    message: string;
    users: User[];
}

export interface UserStatus {
    _id: string;
    status: string;
  }
  
export interface StatusColumnProps {
    record: User;
  }

export interface BankUpdateProps{
    record: User;
}

export interface KycUpdateProps{
    record: User;
}

export interface rechargeStatusUpdate{
    record: Recharge;
}