import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';
import { rechargeStatusUpdate } from '../../types'; 
import { Button, Modal, message, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { customToastStyles } from '../../toastStyles';

import 'antd/dist/reset.css'; 
import '../styles.css'; 

const RechargeUpdateColumn: React.FC<rechargeStatusUpdate> = ({ record }) => {
  const { _id: rechargeId } = record;
  const initialStatus = record.status;
  const [currentStatus, setCurrentStatus] = useState(initialStatus);

  useEffect(() => {
    setCurrentStatus(initialStatus);
  }, [initialStatus]);

  const updateStatus = async (newStatus: string) => {
    const previousStatus = currentStatus; 
    setCurrentStatus(newStatus); 

    try {
      if (newStatus === 'withdraw success') {
        await axios.put(`/admin/recharge/withdrawStatus/${rechargeId}`);
      } else if (newStatus === 'approved/waiting withdraw') {
        await axios.put(`/admin/recharge/approveRecharge/${rechargeId}`);
      } else if (newStatus === 'rejected') {
        await axios.put(`/admin/recharge/rejectRecharge/${rechargeId}`);
      }

      message.success(`Status updated to ${newStatus}`);
      toast.success(`Status updated to ${newStatus}`, {
        style: customToastStyles,
      });
    } catch (error) {
      setCurrentStatus(previousStatus); 
      message.error('Failed to update status');
      toast.error('Failed to update status', {
        style: customToastStyles,
      });
    }
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    Modal.confirm({
      title: <div className="space-micro">Confirm Status Update</div>,
      content: (
        <div className="space-micro">
          Are you sure you want to update the status to{' '}
          <strong style={{ color: getTextColor(key) }}>{key}</strong>?
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
      onOk: () => updateStatus(key),
    });
  };

  const getTextColor = (status: string) => {
    switch (status) {
      case 'withdraw success':
        return 'rgb(5, 163, 65)';
      case 'approved/waiting withdraw':
        return 'rgb(255, 193, 7)';
      case 'rejected':
        return 'red';
      case 'pending':
        return 'rgb(255, 193, 7)';
      default:
        return 'black';
    }
  };

  const getItems = () => {
    if (currentStatus === 'pending') {
      return [
        { key: 'approved/waiting withdraw', label: 'Waiting Withdrawal', className: 'space-micro text-yellow-400 font-bold' },
        { key: 'rejected', label: 'Rejected', className: 'space-micro text-red-500 font-bold' },
      ];
    } else if (currentStatus === 'approved/waiting withdraw') {
      return [{ key: 'withdraw success', label: 'Withdraw Success', className: 'space-micro text-green-500 font-bold' }];
    }
    return [];
  };

  return (
    <>
      {currentStatus === 'withdraw success' || currentStatus === 'rejected' ? (
        <Button
          style={{
            color: getTextColor(currentStatus),
            borderColor: getTextColor(currentStatus),
            borderRadius: '4px',
            padding: '4px 8px',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
          }}
          className="space-micro"
          disabled
        >
          {currentStatus}
        </Button>
      ) : (
        <Dropdown
          menu={{
            items: getItems(),
            onClick: handleMenuClick,
          }}
          trigger={['click']}
        >
          <Button
            style={{
              color: getTextColor(currentStatus),
              borderColor: getTextColor(currentStatus),
              borderRadius: '4px',
              padding: '4px 8px',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
            }}
            className="space-micro"
          >
            {currentStatus} <DownOutlined />
          </Button>
        </Dropdown>
      )}
    </>
  );
};

export default RechargeUpdateColumn;
