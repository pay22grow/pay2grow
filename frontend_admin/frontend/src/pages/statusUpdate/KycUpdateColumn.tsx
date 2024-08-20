/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {  useState } from 'react';
import axios from '../../axiosConfig';
import {  KycUpdateProps } from '../../types'; 
import {  Button, Modal} from 'antd';
import { message, Menu, Dropdown} from 'antd';
import { DownOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css'; 
import '../styles.css'; 

import toast from 'react-hot-toast';
import { customToastStyles } from '../../toastStyles';
const KycUpdateColumn: React.FC<KycUpdateProps > = ({ record }) => {
    const {  _id: userId } = record;
    const [kycUpdateStatus, setKycUpdateStatus] = useState(record.kycVerified);
  
    const updateStatus = async (newStatus: string) => {
      try {
        await axios.put(`/admin/details/updateKycVerified/${userId}`, {
            kycVerified: newStatus,
        });
        setKycUpdateStatus(newStatus);
        message.success(`Kyc Status updated to ${newStatus}`);
        toast.success(`Kyc Status updated to ${newStatus}`,{
          style: customToastStyles, 
        })
      } catch (error) {
        message.error('Failed to update Kyc Status');
        toast.error("Failed to update Kyc Status",{
          style: customToastStyles, 
        });
      }
    };
  
    const handleMenuClick = (e: { key: string }) => {
      const newStatus = e.key;
  
      Modal.confirm({
        title: <div className="space-micro">Confirm Status Update</div>,
        content: (
          <div className="space-micro">
            Are you sure you want to update the kyc status to{' '}
            <strong style={{ color: getTextColor(newStatus) }}>{newStatus}</strong>?
          </div>
        ),
        okText: <span className="space-micro">Yes</span>,
        cancelText: <span className="space-micro">No</span>,
        okButtonProps: {
          className: 'space-micro',
        },
        cancelButtonProps: {
          className: 'space-micro',
        },
        onOk: () => updateStatus(newStatus),
      });
    };
  
    const getTextColor = (kycUpdateStatus: string) => {
      switch (kycUpdateStatus) {
        case 'verified':
          return 'rgb(5, 163, 65)'; 
        case 'pending':
          return 'rgb(255, 193, 7)'; 
        case 'rejected':
          return 'red'; 
        default:
          return 'black';
      }
    };

    const menu = (
      <Menu onClick={handleMenuClick} className='space-micro'>
        <Menu.Item key="verified" className='space-micro'>Verified</Menu.Item>
        <Menu.Item key="pending" className='space-micro'>Pending</Menu.Item>
        <Menu.Item key="rejected" className='space-micro'>Rejected</Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Button
          style={{
            color: getTextColor(kycUpdateStatus), 
            borderColor: getTextColor(kycUpdateStatus), 
            borderRadius: '4px',
            padding: '4px 8px',
            
          }}
          className='space-micro'
        >
          {kycUpdateStatus} <DownOutlined />
        </Button>
      </Dropdown>
    );
  };
  export default KycUpdateColumn;