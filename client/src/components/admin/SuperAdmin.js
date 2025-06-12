import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Avatar, Select, Divider } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined,
  DollarOutlined,
  TransactionOutlined,
  TeamOutlined
} from '@ant-design/icons';

export default function SuperAdmin() {
  const [loading, setLoading] = useState(true);
  const [transfersData, setTransfersData] = useState([]);
  const [region, setRegion] = useState('all');
  const [timeframe, setTimeframe] = useState('monthly');

  // Generate chart image URLs from QuickChart.io
  const getChartImage = (type, data, labels, options = {}) => {
    const chartConfig = {
      type,
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: options.backgroundColor || [
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: options.borderColor || [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: {
            display: options.showLegend || false
          }
        }
      }
    };

    return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
  };

  // Sample data processing
  const processData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const regions = ['North', 'South', 'East', 'West'];
    
    const monthlyAmounts = [12000, 19000, 3000, 5000, 2000, 3000];
    const regionalDistribution = [30000, 15000, 20000, 35000];
    const transferTypes = [65, 25, 10];
    
    return {
      lineChartUrl: getChartImage('line', monthlyAmounts, months),
      barChartUrl: getChartImage('bar', regionalDistribution, regions),
      pieChartUrl: getChartImage('pie', transferTypes, ['Welfare', 'Pension', 'Subsidy'], { showLegend: true })
    };
  };

  const charts = processData();

  return (
    <div className="p-4">
      <Divider orientation="left">Overview</Divider>
      
      <Row gutter={16} className="mb-4">
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Transfers"
              value={112893}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Beneficiaries"
              value={24567}
              valueStyle={{ color: '#3f8600' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="This Month"
              value={8846}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Approvals"
              value={27}
              valueStyle={{ color: '#cf1322' }}
              prefix={<TransactionOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <Card 
            title="Monthly Transfers Trend"
            extra={
              <Select defaultValue="monthly" onChange={setTimeframe}>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="quarterly">Quarterly</Select.Option>
              </Select>
            }
          >
            <img 
              src={charts.lineChartUrl} 
              alt="Monthly Transfers Chart" 
              style={{ width: '100%' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            title="Regional Distribution"
            extra={
              <Select defaultValue="all" onChange={setRegion}>
                <Select.Option value="all">All Regions</Select.Option>
                <Select.Option value="north">North</Select.Option>
                <Select.Option value="south">South</Select.Option>
              </Select>
            }
          >
            <img 
              src={charts.barChartUrl} 
              alt="Regional Distribution Chart" 
              style={{ width: '100%' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Transfer Types">
            <img 
              src={charts.pieChartUrl} 
              alt="Transfer Types Chart" 
              style={{ width: '100%' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Recent Transactions">
            <div className="recent-transfers">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="transfer-item">
                  <Avatar icon={<UserOutlined />} />
                  <div className="transfer-details">
                    <span className="recipient">Beneficiary {i}</span>
                    <span className="amount">${(1000 + i * 200).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="System Alerts">
            <div className="alerts-list">
              {[
                "3 pending approvals in North region",
                "New transfer policy update available",
                "System maintenance scheduled for Friday",
                "2 high-value transfers require verification"
              ].map((alert, i) => (
                <div key={i} className="alert-item">
                  {alert}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .transfer-item {
          display: flex;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .transfer-details {
          margin-left: 16px;
          flex-grow: 1;
        }
        .recipient {
          display: block;
          font-weight: 500;
        }
        .amount {
          color: #52c41a;
        }
        .alert-item {
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
          color: #d48806;
        }
      `}</style>
    </div>
  );
}