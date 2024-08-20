/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {  useState } from 'react';
import axios from '../../axiosConfig';
import {  StatusColumnProps } from '../../types'; 
import {  Button, Modal} from 'antd';
import { message, Menu, Dropdown} from 'antd';
import { DownOutlined } from '@ant-design/icons';

import 'antd/dist/reset.css'; 
import '../styles.css'; 

import toast from 'react-hot-toast';
import { customToastStyles } from '../../toastStyles';
const StatusColumn: React.FC<StatusColumnProps > = ({ record }) => {
    const {  _id: userId } = record;
    const [status, setStatus] = useState(record.status);
  
    const updateStatus = async (newStatus: string) => {
      try {
        await axios.put(`/admin/details/updateStatus/${userId}`, {
          status: newStatus,
        });
        setStatus(newStatus);
        message.success(`Status updated to ${newStatus}`);
        toast.success(`Status updated to ${newStatus}`,{
          style: customToastStyles, 
        })
      } catch (error) {
        message.error('Failed to update status');
        toast.error("Failed to update status",{
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
            Are you sure you want to update the status to{' '}
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
    const getTextColor = (status: string) => {
      switch (status) {
        case 'Active':
          return 'rgb(5, 163, 65)'; 
        case 'Inactive':
          return 'rgb(255, 193, 7)'; 
        case 'Blocked':
          return 'red'; 
        default:
          return 'black';
      }
    };
  
    const menu = (
      <Menu onClick={handleMenuClick} className='space-micro'>
        <Menu.Item key="Active" className='space-micro'>Active</Menu.Item>
        <Menu.Item key="Inactive" className='space-micro'>Inactive</Menu.Item>
        <Menu.Item key="Blocked" className='space-micro'>Blocked</Menu.Item>
      </Menu>
    );
  
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <Button
          style={{
            color: getTextColor(status), 
            borderColor: getTextColor(status), 
            borderRadius: '4px',
            padding: '4px 8px',
            
          }}
          className='space-micro'
        >
          {status} <DownOutlined />
        </Button>
      </Dropdown>
    );
  };
  export default StatusColumn;