/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import axios from '../axiosConfig';
import { UsersResponse, User } from '../types'; 
import { Table, Button, Modal, Spin, Alert,Image,Input, TableColumnsType} from 'antd';
import { InputRef, TableColumnType,  Space} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import 'antd/dist/reset.css'; 
import './styles.css'; 
import Header from './Header';
import Footer from './Footer';
type DataIndex = keyof User;


const UserProfile: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [noUsers, setNoUsers] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<number>(10); // Default page size
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get<UsersResponse>('/admin/details/getAllUsers');
                if (response.data.success) {
                    const users = response.data.users || [];
                    setUsers(users);
                    setNoUsers(users.length === 0);
                } else {
                    setError(response.data.message);
                    setNoUsers(true);
                }
                setLoading(false);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.message || 'An unknown error occurred');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);
    const handlePageSizeChange = (current: number, size: number) => {
      setPageSize(size);
      setCurrentPage(current);
  };
    type Status = 'Active' | 'Inactive' | 'Blocked' ;

    const statusColors: Record<Status, string> = {
        Active: '#52C41A', 
        Inactive: '#FFC107',  
        Blocked: '#FF4D4F', 
    };
    const handleSearch = (
      selectedKeys: string[],
      confirm: FilterDropdownProps['confirm'],
      dataIndex: DataIndex,
    ) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
  
    const handleReset = (clearFilters: () => void) =>{
      clearFilters();
      setSearchText('');
    }
    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<User> => ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
            className='space-micro'
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
              className='space-micro'
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
              className='space-micro'
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
              className='space-micro'
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
              className='space-micro'
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    });

    const userColumns: TableColumnsType<User> = [
      {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          ...getColumnSearchProps('name'),
          sorter: (a: User, b: User) => a.name.localeCompare(b.name),
          render: (name: string) => <span className="space-mono">{name}</span>,
      },
      {
        title: 'Phone Number',
        dataIndex: 'phoneNumber',
        key: 'phoneNumber',
        ...getColumnSearchProps('phoneNumber'),
        sorter: (a: User, b: User) => a.phoneNumber.localeCompare(b.phoneNumber),
        render: (phoneNumber: string) => <span className="space-mono">{phoneNumber}</span>,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        ...getColumnSearchProps('email'),
        sorter: (a: User, b: User) => a.email.localeCompare(b.email),
        render: (email: string) => <span className="space-mono">{email}</span>,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      sorter: (a: User, b: User) => (a.balance ?? 0) - (b.balance ?? 0),
      render: (balance: number) => (
          <span className="space-mono text-center" style={{ color: 'blue', fontWeight: 'bold' }}>
              {balance.toFixed(2)}
          </span>
      ),
  },
  {
      title: 'Pending',
      dataIndex: 'pending',
      key: 'pending',
      sorter: (a: User, b: User) => (a.pending ?? 0) - (b.pending ?? 0),
      render: (pending: number) => (
          <span className="space-mono text-center" style={{ color: 'red', fontWeight: 'bold' }}>
              {pending.toFixed(2)}
          </span>
      ),
  },
  {
      title: 'Invite Code',
      dataIndex: 'uniqueInvitationCode',
      key: 'uniqueInvitationCode',
      ...getColumnSearchProps('uniqueInvitationCode'),
      sorter: (a: User, b: User) => a.uniqueInvitationCode.localeCompare(b.uniqueInvitationCode),
      render: (invitationCode: string) => (
          <span className="space-micro text-blue-500 text-center" style={{ fontWeight: 'bold' }}>
              {invitationCode}
          </span>
      ),
  },
  
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        filters: [
            { text: 'Active', value: 'Active' },
            { text: 'Inactive', value: 'Inactive' },
            { text: 'Blocked', value: 'Blocked' },
        ],
        onFilter: (value: any, record: User) => record.status === value,
        render: (status: string) => {
            switch (status) {
                case 'Active':
                    return (
                        <span className="space-mono" style={{ fontWeight: 'bold', color: 'rgb(5, 163, 65)' }}>
                            {status}
                        </span>
                    );
                case 'Inactive':
                    return (
                        <span className="space-mono" style={{ fontWeight: 'bold', color: 'rgb(255, 193, 7)' }}>
                            {status}
                        </span>
                    );
                case 'Blocked':
                    return (
                        <span className="space-mono" style={{ fontWeight: 'bold', color: 'red' }}>
                            {status}
                        </span>
                    );
                default:
                    return null;
            }
        },
    }, 
    {
      title: 'Bank Update Request',
      dataIndex: 'bankUpdateRequest',
      key: 'bankUpdateRequest',
      filters: [
          { text: 'Upload Bank Details', value: 'uploadBankDetails' },
          { text: 'Rejected', value: 'rejected' },
          { text: 'Approved', value: 'approved' },
          { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value: any, record: User) => record.bankUpdateRequest === value,
      render: (bankUpdateRequest: string) => {
          let color;
          let displayText;
  
          switch (bankUpdateRequest) {
              case 'approved':
                  color = 'rgb(5, 163, 65)';
                  displayText = 'Approved';
                  break;
              case 'uploadBankDetails':
                  color = 'black';
                  displayText = 'Bank details not Uploaded';
                  break;
              case 'pending':
                  color = 'rgb(255, 193, 7)';
                  displayText = 'Pending';
                  break;
              case 'rejected':
                  color = 'red';
                  displayText = 'Rejected';
                  break;
              default:
                  color = 'black';
                  displayText = 'Unknown';
          }
  
          return (
              <span className="space-mono" style={{ color, fontWeight: 'bold' }}>
                  {displayText}
              </span>
          );
      },
  },    

{
  title: 'Bank Details',
  dataIndex: 'bankDetails',
  key: 'bankDetails',
  render: (bankDetails: any, record: User) => {
      const { bankUpdateRequest } = record;

      // Check if bankDetails is empty or not provided
      const isEmptyBankDetails = !bankDetails || Object.keys(bankDetails).length === 0;

      const displayText = bankUpdateRequest === 'uploadBankDetails' || isEmptyBankDetails
          ? '--'
          : (
              <>
                  <div style={{ display: 'flex', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 'bold', marginRight: '8px' }}>Acc No:</div>
                      <div>{bankDetails?.accNo ?? 'N/A'}</div>
                  </div>
                  <div style={{ display: 'flex', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 'bold', marginRight: '8px' }}>IFSC:</div>
                      <div>{bankDetails?.ifscCode ?? 'N/A'}</div>
                  </div>
                  <div style={{ display: 'flex', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 'bold', marginRight: '8px' }}>Branch:</div>
                      <div>{bankDetails?.branch ?? 'N/A'}</div>
                  </div>
                  <div style={{ display: 'flex', marginBottom: '4px' }}>
                      <div style={{ fontWeight: 'bold', marginRight: '8px' }}>Payee:</div>
                      <div>{bankDetails?.payeeName ?? 'N/A'}</div>
                  </div>
              </>
          );

      const textColor = bankUpdateRequest === 'uploadBankDetails' || isEmptyBankDetails ? 'grey' : 'black';

      return (
          <div className="space-mono" style={{ color: textColor, fontWeight: 'bold' }}>
              {displayText}
          </div>
      );
  },
}
,
{
        title: 'KYC Verified',
        dataIndex: 'kycVerified',
        key: 'kycVerified',
        filters: [
            { text: 'Verified', value: 'verified' },
            { text: 'Pending', value: 'pending' },
            { text: 'Rejected', value: 'rejected' },
            { text: 'KYC not uploaded by user', value: 'verifyKyc' },
        ],
        onFilter: (value: any, record: User) => record.kycVerified === value,
        render: (kycVerified: string) => {
            switch (kycVerified) {
                case 'verified':
                    return (
                        <span className="space-mono" style={{ fontWeight: 'bold', color: 'rgb(5, 163, 65)' }}>
                            Verified
                        </span>
                    );
                case 'pending':
                    return (
                        <span className="space-mono" style={{ fontWeight: 'bold', color: 'rgb(255, 193, 7)' }}>
                            Pending
                        </span>
                    );
                case 'rejected':
                    return (
                        <span className="space-mono" style={{ fontWeight: 'bold', color: 'red' }}>
                            Rejected
                        </span>
                    );
                case 'verifyKyc':
                    return (
                        <span className="space-mono text-blue-500" style={{ fontWeight: 'bold' }}>
                            KYC not uploaded by user
                        </span>
                    );
                default:
                    return null;
            }
        },
    },    
    {
      title: 'KYC',
      dataIndex: 'kyc',
      key: 'kyc',
      render: (kyc: string) => (
          <>
              {kyc ? (
                  <div className="h-8 w-8 flex items-center justify-center mr-2">
                      <Image
                          src={kyc}
                          width={32}
                          height={32}
                          className="h-full w-full"
                          style={{ objectFit: 'contain', background: 'white' }}
                      />
                  </div>
              ) : (
                  <span style={{ color: 'grey', fontWeight: 'bold' }}>--</span>
              )}
          </>
      ),
  },  
  ];

    if (loading) return (
      <div className="loading-container">
          <Spin tip="Loading..." />
      </div>
  );
    if (error) return <Alert message="Error" description={error} type="error" showIcon />;
    if (noUsers) return (
      <>
      <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-6">
      <Header />
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50  mg-8 min-h-screen">
      <div className="bg-white p-6 mb-40 rounded-lg shadow-md max-w-md w-full text-center">
            <p className="text-gray-700 mb-4 space-mono text-lg">
                No users found.
            </p>
            <Button
                onClick={() => navigate('/home')}
                type="primary"
                className="bg-blue-500 border-blue-500 hover:bg-blue-600 hover:border-blue-600"
            >
                Go to Home Page
            </Button>
        </div>
        </div>
        <Footer />
      </div>
      </>
    );
    return (
        <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-6">
        <Header />  
        <h1 className="text-2xl space-micro font-bold mb-2">Users</h1>
        
        {/* Desktop View */}
        <div className="desktop-view">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Table
              columns={userColumns}
              dataSource={users}
              rowKey="_id"
              bordered
              size="small"
              loading={loading}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                onChange: (page, size) => handlePageSizeChange(page, size),
              }}
              className="ant-table-rounded ant-table-striped"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)', backgroundColor: '#fff' }}
              scroll={{ x: true }}
            />
          </div>
        </div>
        
        {/* Mobile View
        <div className="mobile-view">
          <div className="bg-white space-micro p-4 rounded-lg shadow-md">
            {users.map((user) => (
              <div key={user._id} className="recharge-card mb-4">
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Status:</strong> <span style={{ color: statusColors[user.status as Status] }}>{user.status}</span></div>
                <div><strong>Phone Number:</strong> {user.phoneNumber}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Balance:</strong> {user.balance}</div>
                <div><strong>Pending:</strong> {user.pending}</div>
                <div><strong>KYC Verified:</strong> {user.kycVerified ? 'Yes' : 'No'}</div>
                <div><strong>Bank Details:</strong> 
                  <div>Account No: {user.bankDetails?.accNo ?? 'N/A'}</div>
                  <div>IFSC Code: {user.bankDetails?.ifscCode ?? 'N/A'}</div>
                  <div>Branch: {user.bankDetails?.branch ?? 'N/A'}</div>
                  <div>Payee Name: {user.bankDetails?.payeeName ?? 'N/A'}</div>
                </div>
                <div><strong>Invitation Code:</strong> {user.invitationCode}</div>
                <div><strong>Bank Update Request:</strong> {user.bankUpdateRequest}</div>
                <div><strong>KYC:</strong>
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => setPreviewImage(user.kyc)} 
                    type="link"
                  >
                    View KYC
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-10">
              <Footer />
            </div>
          </div>
        </div> */}


        <div className="mobile-view">
          <div className="bg-white space-micro p-4 rounded-lg shadow-md">
            {users.map((user) => (
              <div key={user._id} className="recharge-card mb-4">
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Status:</strong> <span style={{ color: statusColors[user.status as Status] }}>{user.status}</span></div>
                <div><strong>Phone Number:</strong> {user.phoneNumber}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Balance:</strong> <span style={{ color: 'blue' }}>{user.balance}</span></div>
                <div><strong>Pending:</strong> <span style={{ color: 'lightcoral' }}>{user.pending}</span></div>
                <div><strong>KYC Verified:</strong> 
                  {user.kycVerified === 'verified' ? (
                    <span style={{ color: 'rgb(5, 163, 65)' }}>Verified</span>
                  ) : user.kycVerified === 'pending' ? (
                    <span style={{ color: 'rgb(255, 193, 7)' }}>Pending</span>
                  ) : user.kycVerified === 'rejected' ? (
                    <span style={{ color: 'red' }}>Rejected</span>
                  ) : user.kycVerified === 'verifyKyc' ? (
                    <span>KYC not uploaded</span>
                  ) : null}
                </div>
                <div><strong>Bank Details:</strong> 
                  {user.bankUpdateRequest === 'uploadBankDetails' ? (
                    <div>Bank details not uploaded</div>
                  ) : (
                    <div>
                      <div>Account No: {user.bankDetails?.accNo ?? 'N/A'}</div>
                      <div>IFSC Code: {user.bankDetails?.ifscCode ?? 'N/A'}</div>
                      <div>Branch: {user.bankDetails?.branch ?? 'N/A'}</div>
                      <div>Payee Name: {user.bankDetails?.payeeName ?? 'N/A'}</div>
                    </div>
                  )}
                </div>
                <div className='text-md'><strong>Invitation Code:</strong> <span className='text-blue-500 text-md'>{user.uniqueInvitationCode}</span></div>
                <div><strong>Bank Update Request:</strong> 
                  {user.bankUpdateRequest === 'approved' ? (
                    <span style={{ color: 'rgb(5, 163, 65)' }}>Approved</span>
                  ) : user.bankUpdateRequest === 'uploadBankDetails' ? (
                    <div>Bank details not uploaded</div>
                  ) : user.bankUpdateRequest === 'pending' ? (
                    <span style={{ color: 'rgb(255, 193, 7)' }}>Pending</span>
                  ) : user.bankUpdateRequest === 'rejected' ? (
                    <span style={{ color: 'red' }}>Rejected</span>
                  ) : null}
                </div>
                <div><strong>KYC:</strong>
                  <Button 
                    icon={<EyeOutlined />} 
                    onClick={() => setPreviewImage(user.kyc)} 
                    type="link"
                  >
                    View KYC
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-10">
              <Footer />
            </div>
          </div>
        </div>



        <Modal
          visible={!!previewImage}
          footer={null}
          onCancel={() => setPreviewImage(null)}
          title="Recharge Proof"
        >
          {previewImage && <img src={`${previewImage}`} alt="Recharge Proof" style={{ width: '100%' }} />}
        </Modal>
      
        {/* Footer */}
        <div className="mt-10">
        <Footer />
      </div>
      </div> 
  );
};

export default UserProfile;


