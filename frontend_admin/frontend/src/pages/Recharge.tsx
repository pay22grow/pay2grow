/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { GetRechargesResponse, Recharge, UserInfo } from '../types'; 
import { Table, Button, Modal, Spin, Alert,Image, TableColumnsType, Input, Space, TableColumnType, InputRef} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css'; 
import './styles.css'; 
import Header from './Header';
import Footer from './Footer';
import { SearchOutlined } from '@ant-design/icons';
import RechargeUpdateColumn from './statusUpdate/rechargeStatusUpdate';
import { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
type DataIndex = keyof Recharge | 'userInfo.name' | 'userInfo.phoneNumber' | 'userInfo.email';
const HistoryPage: React.FC = () => {
    const [recharges, setRecharges] = useState<Recharge[]>([]);
    const [mobileRecharges, setMobileRecharges] = useState<Recharge[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [noRecharges, setNoRecharges] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [pageSize, setPageSize] = useState<number>(10); // Default page size
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchRecharges = async () => {
            try {
                const response = await axios.get<GetRechargesResponse>('/admin/recharge/getAllRecharges');
                if (response.data.status) {
                    const recharges = response.data.recharges || [];
                    const mobileRecharges = response.data.recharges || [];
                    setRecharges(recharges);
                    setMobileRecharges(mobileRecharges);
                    setNoRecharges(recharges.length === 0);
                } else {
                    setError(response.data.message);
                    setNoRecharges(true);
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

        fetchRecharges();
    }, []);
    const handlePageSizeChange = (current: number, size: number) => {
      setPageSize(size);
      setCurrentPage(current);
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
    const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Recharge> => ({
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
              Close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
      ),
      onFilter: (value : any, record: any) => {
        // Check if it's a nested field
        if (dataIndex.startsWith('userInfo.')) {
          const [_, subField] = dataIndex.split('.'); // Get the subfield (e.g., 'name')
          return record.userInfo[subField as keyof UserInfo]
            ?.toString()
            .toLowerCase()
            .includes((value as string).toLowerCase());
        } else {
          // Handle direct fields
          return record[dataIndex as keyof Recharge]
            ?.toString()
            .toLowerCase()
            .includes((value as string).toLowerCase());
        }
      },
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
    const sortRecharges = (mobileRecharges: any[]) => {
      return mobileRecharges.slice().sort((a, b) => {
        const statusOrder: { [key: string]: number } = {
          pending: 1,
          'withdrawal pending': 2,
          'withdraw success': 3,
          rejected: 4,
        };
  
        // Compare statuses
        const statusComparison = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
        if (statusComparison !== 0) {
          return statusComparison;
        }
  
        // Compare dates if statuses are the same
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    };
  
    // Sort the recharges
    const sortedRecharges = sortRecharges(mobileRecharges);

    const columns: TableColumnsType<Recharge> = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a: Recharge, b: Recharge) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (timestamp: string) => {
                const date = new Date(timestamp);
                const options: Intl.DateTimeFormatOptions = {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                };
                const istDate = new Intl.DateTimeFormat('en-IN', options).format(date);
                return <span className="space-mono">{istDate}</span>;
            },
        },
        {
          title: 'Name',
          dataIndex: 'userInfo',
          key: 'name',
          ...getColumnSearchProps('userInfo.name'),
          sorter: (a: Recharge, b: Recharge) => a.userInfo.name.localeCompare(b.userInfo.name),
          render: (userInfo: UserInfo) => <span className="space-mono">{userInfo.name}</span>,
        },
        {
          title: 'Phone Number',
          dataIndex: 'userInfo',
          key: 'phoneNumber',
          ...getColumnSearchProps('userInfo.phoneNumber'),
          sorter: (a: Recharge, b: Recharge) => a.userInfo.phoneNumber.localeCompare(b.userInfo.phoneNumber),
          render: (userInfo: UserInfo) => <span className="space-mono">{userInfo.phoneNumber}</span>,
        },
        {
          title: 'Email',
          dataIndex: 'userInfo',
          key: 'email',
          ...getColumnSearchProps('userInfo.email'),
          sorter: (a: Recharge, b: Recharge) => a.userInfo.email.localeCompare(b.userInfo.email),
          render: (userInfo: UserInfo) => <span className="space-mono">{userInfo.email}</span>,
        },
        {
            title: 'Points Bought',
            dataIndex: 'buyPoints',
            key: 'buyPoints',
            sorter: (a: Recharge, b: Recharge) => (a.buyPoints ?? 0) - (b.buyPoints ?? 0),
            render: (text: number) => <span className="space-mono">{text}</span>,
        },
        {
            title: 'Points to Pay',
            dataIndex: 'receivePoints',
            key: 'receivePoints',
            sorter: (a: Recharge, b: Recharge) => (a.receivePoints ?? 0) - (b.receivePoints ?? 0),
            render: (text: number) => <span className="space-mono" style={{fontWeight: 'bold'}}>{text.toFixed(2)}</span>,
        },
        {
          title: 'Amount Paid by User',
          dataIndex: 'needToPayUSDT',
          key: 'needToPayUSDT',
          sorter: (a: Recharge, b: Recharge) => (a.needToPayUSDT ?? 0) - (b.needToPayUSDT ?? 0),
          render: (text: number) => (
              <span className='space-mono' style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '16px',
              }}>
                  <span style={{
                      fontSize: '18px',
                      lineHeight: '1',
                      verticalAlign: 'middle', 
                      marginRight: '4px' 
                  }}>$</span>
                  <span style={{
                      fontSize: '16px',
                      lineHeight: '1',
                      fontWeight: 'bold'
                  }}>{text}</span>
              </span>
          ),
        }
        ,      
        {
          title: 'Profit of User',
          dataIndex: 'profit',
          key: 'profit',
          sorter: (a: Recharge, b: Recharge) => (a.profit ?? 0) - (b.profit ?? 0),
          render: (text: number) => 
          <><span className='space-mono end-aligned' style={{
            fontWeight: 'bold',
            color: 'rgb(5, 163, 65)',
            display: 'inline-flex',
            boxAlign: 'center',
            alignItems: 'center',
            transition: 'color 0.3s ease 0s',
            }}>{text} Rs</span>
          </>,
      },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
              { text: 'Pending', value: 'pending' },
              { text: 'Withdraw Pending', value: 'approved/waiting withdraw' },
              { text: 'Success', value: 'withdraw success' },
              { text: 'Rejected', value: 'rejected' },
            ],
            onFilter: (value: any, record: Recharge) => {
              return record.status === value;
            },  
            render: (_status:string, record: Recharge) =>{
              return (
                <RechargeUpdateColumn record={record} />
              )
            }
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            sorter: (a: Recharge, b: Recharge) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (timestamp: string) => timestamp ? (
                <span className="space-mono">{new Intl.DateTimeFormat('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                }).format(new Date(timestamp))}</span>
            ) : 'N/A',
        },
        {
            title: 'Buy Price',
            dataIndex: 'buyPrice',
            key: 'buyPrice',
            sorter: (a: Recharge, b: Recharge) => (a.buyPrice ?? 0) - (b.buyPrice ?? 0),
            render: (text: number) => text !== undefined ? <span className="space-mono">{text}</span> : 'N/A',
        },
        {
            title: 'Sell Price',
            dataIndex: 'sellPrice',
            key: 'sellPrice',
            sorter: (a: Recharge, b: Recharge) => (a.sellPrice ?? 0) - (b.sellPrice ?? 0),
            render: (text: number) => text !== undefined ? <span className="space-mono">{text}</span> : 'N/A',
        },
        {
            title: 'Proof',
            dataIndex: 'rechargeProof',
            key: 'rechargeProof',
            render: (rechargeProof: string) => (
                <>
                 <div className="h-8 w-8 flex items-center justify-center mr-2">
                    <Image
                      src={`${rechargeProof}`}
                      width={32}
                      height={32}
                      className="h-full w-full"
                      style={{
                        objectFit: 'contain',
                        background: 'white'
                      }}
                    />
                  </div>
              
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
    if (noRecharges) return (
      <>
      <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 p-6">
      <Header />
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50  mg-8 min-h-screen">
      <div className="bg-white p-6 mb-40 rounded-lg shadow-md max-w-md w-full text-center">
            <p className="text-gray-700 mb-4 space-mono text-lg">
                No recharges found.
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
        <h1 className="text-2xl space-micro font-bold mb-2">Recharge History</h1>
        
        {/* Desktop View */}
        <div className="desktop-view">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Table
              columns={columns}
              dataSource={recharges}
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
        
        {/* Mobile View */}
        {/* <div className="mobile-view">
          <div className="bg-white space-micro p-4 rounded-lg shadow-md">
            {recharges.map((recharge) => (
              <div key={recharge._id} className="recharge-card">
                <h2><strong >Recharge ID: {recharge._id}</strong></h2>
                <p><strong >Date:</strong> {new Intl.DateTimeFormat('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                      }).format(new Date(recharge.createdAt))}</p>
                      <div><strong>Name:</strong> {recharge.userInfo.name}</div>
                      <div><strong>Phone Number:</strong> {recharge.userInfo.phoneNumber}</div>
                      <div><strong>Email:</strong> {recharge.userInfo.email}</div>
                      <p><strong>Points Bought:</strong> {recharge.buyPoints}</p>
                      <p><strong>Points to Pay:</strong> {recharge.receivePoints}</p>
                      <p><strong>Amount paid by User:</strong> ${recharge.needToPayUSDT}</p>
                      <p><strong>Profit of User:</strong><span style={{color: 'rgb(5, 163, 65)', marginLeft:'4px'}}>{recharge.profit} Rs</span></p>
                      <div><strong>Status:</strong><RechargeUpdateColumn record={recharge}/></div>
                      <p><strong>Last Updated:</strong> {new Intl.DateTimeFormat('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                      }).format(new Date(recharge.updatedAt))}</p>
                      <p><strong>Buy Price:</strong> {recharge.buyPrice ?? 'N/A'}</p>
                      <p><strong>Sell Price:</strong> {recharge.sellPrice ?? 'N/A'}</p>
                      <p><span style={{fontWeight:'bold'}}>Recharge Proof:</span>
                      <Button 
                        icon={<EyeOutlined />} 
                        onClick={() => setPreviewImage(recharge.rechargeProof)} 
                        type="link"
                      >
                        View Proof
                      </Button></p>
                      
              </div>
            ))}
            <div className="mt-10">
                <Footer />
            </div>
          </div>
        </div> */}

        {/* Mobile View */}
      <div className="mobile-view">
        <div className="bg-white space-micro p-4 rounded-lg shadow-md">
          {sortedRecharges.map((recharge) => (
            <div key={recharge._id} className="recharge-card">
              <h2><strong>Recharge ID: {recharge._id}</strong></h2>
              <p>
                <strong>Date:</strong> {new Intl.DateTimeFormat('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }).format(new Date(recharge.createdAt))}
              </p>
              <div><strong>Name:</strong> {recharge.userInfo.name}</div>
              <div><strong>Phone Number:</strong> {recharge.userInfo.phoneNumber}</div>
              <div><strong>Email:</strong> {recharge.userInfo.email}</div>
              <p><strong>Points Bought:</strong> {recharge.buyPoints}</p>
              <p><strong>Points to Pay:</strong> {recharge.receivePoints}</p>
              <p><strong>Amount paid by User:</strong> ${recharge.needToPayUSDT}</p>
              <p><strong>Profit of User:</strong><span style={{ color: 'rgb(5, 163, 65)', marginLeft: '4px' }}>{recharge.profit} Rs</span></p>
              <div><strong>Status:</strong><RechargeUpdateColumn record={recharge} /></div>
              <p><strong>Last Updated:</strong> {new Intl.DateTimeFormat('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }).format(new Date(recharge.updatedAt))}</p>
              <p><strong>Buy Price:</strong> {recharge.buyPrice ?? 'N/A'}</p>
              <p><strong>Sell Price:</strong> {recharge.sellPrice ?? 'N/A'}</p>
              <p><span style={{ fontWeight: 'bold' }}>Recharge Proof:</span>
                <Button 
                  icon={<EyeOutlined />} 
                  onClick={() => setPreviewImage(recharge.rechargeProof)} 
                  type="link"
                >
                  View Proof
                </Button>
              </p>
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

export default HistoryPage;


