/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import axios from '../../axiosConfig';
import {  BankUpdateProps } from '../../types'; 
import {  Button, Modal} from 'antd';
import { message, Menu, Dropdown} from 'antd';
import { DownOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css'; 
import '../styles.css'; 

import toast from 'react-hot-toast';
import { customToastStyles } from '../../toastStyles';
const BankUpdateColumn: React.FC<BankUpdateProps > = ({ record }) => {
    const {  _id: userId } = record;
    const [bankUpdateStatus, setBankUpdateStatus] = useState(record.bankUpdateRequest);
  
    const updateStatus = async (newStatus: string) => {
      try {
        await axios.put(`/admin/details/updateBankUpdateRequest/${userId}`, {
            bankUpdateRequest: newStatus,
        });
        setBankUpdateStatus(newStatus);
        message.success(`Bank Status updated to ${newStatus}`);
        toast.success(`Bank Status updated to ${newStatus}`,{
          style: customToastStyles, 
        })
      } catch (error) {
        message.error('Failed to update Bank Status');
        toast.error("Failed to update Bank Status",{
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
            Are you sure you want to update the bank status to{' '}
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
  
    // Function to get text color based on status
    const getTextColor = (bankUpdateStatus: string) => {
      switch (bankUpdateStatus) {
        case 'approved':
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
        <Menu.Item key="approved" className='space-micro'>Approved</Menu.Item>
        <Menu.Item key="pending" className='space-micro'>Pending</Menu.Item>
        <Menu.Item key="rejected" className='space-micro'>Rejected</Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Button
          style={{
            color: getTextColor(bankUpdateStatus), 
            borderColor: getTextColor(bankUpdateStatus), 
            borderRadius: '4px',
            padding: '4px 8px',
            
          }}
          className='space-micro'
        >
          {bankUpdateStatus} <DownOutlined />
        </Button>
      </Dropdown>
    );
  };
  export default BankUpdateColumn;