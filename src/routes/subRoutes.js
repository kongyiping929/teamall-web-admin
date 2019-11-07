/*
 * @Description: 
 * @Author: wangzv
 * @Date: 2019-08-06 17:30:45
 * @LastEditors: wangzv
 * @LastEditTime: 2019-08-06 17:30:45
 */
import React from 'react';
import Async from '../components/AsyncComponent/AsyncComponent';

const UserMes = Async(() => import('../views/SubViews/sub1/UserMes/UserMes'))
const DataMes = Async(() => import('../views/SubViews/sub1/DataMes/DataMes'))
const StoreControl = Async(() => import('../views/SubViews/sub2/StoreControl'))
const Banner = Async(() => import('../views/SubViews/sub10/Banner/Banner'))
const Royalty = Async(() => import('../views/SubViews/sub7/Royalty/Royalty'))
const Release = Async(() => import('../views/SubViews/sub7/Release/Release'))
const MessageAdmin = Async(() => import('../views/SubViews/sub6/MessageAdmin/MessageAdmin'))
const Recharge = Async(() => import('../views/SubViews/sub3/Recharge/Recharge'))
const Extract = Async(() => import('../views/SubViews/sub3/Extract/Extract'))
const RechargeLimit = Async(() => import('../views/SubViews/sub3/RechargeLimit/RechargeLimit'))
const ThresholdValue = Async(() => import('../views/SubViews/sub9/ThresholdValue/ThresholdValue'))
const Operator = Async(() => import('../views/SubViews/sub9/Operator/Operator'))
const ProductOrder = Async(() => import('../views/SubViews/sub5/ProductOrder/ProductOrder'))
const ReserveOrder = Async(() => import('../views/SubViews/sub5/ReserveOrder/ReserveOrder'))
const DiscountCoupon = Async(() => import('../views/SubViews/sub4/DiscountCoupon/DiscountCoupon'))
const ProductClassify = Async(() => import('../views/SubViews/sub4/ProductClassify/ProductClassify'))
const ProductMsgCtrl = Async(() => import('../views/SubViews/sub4/ProductMsgCtrl/ProductMsgCtrl'))

export default [
    {
        name: 'sub1',
        title: '用户管理',
        children: [
            {
                key: '100',
                title: '用户信息',
                path: '/sub1/100',
                component: UserMes
            },
            {
                key: '101',
                title: '数据管理',
                path: '/sub1/101',
                component: DataMes
            }
        ]
    },
    {
        name: 'sub2',
        title: '店铺管理',
        children: [
            {
                key: '200',
                title: '店铺管理',
                path: '/sub2/200',
                component: StoreControl
            }
        ]
    },
    {
        name: 'sub3',
        title: '充值提现管理',
        children: [
            {
                key: '300',
                title: '充值记录',
                path: '/sub3/300',
                component: Recharge
            },
            {
                key: '301',
                title: '提现申请',
                path: '/sub3/301',
                component: Extract
            },
            {
                key: '302',
                title: '预充值额度管理',
                path: '/sub3/302',
                component: RechargeLimit
            }
        ]
    },
    {
        name: 'sub4',
        title: '产品管理',
        children: [
            {
                key: '400',
                title: '产品分类管理',
                path: '/sub4/400',
                component: ProductClassify
            },
            {
                key: '401',
                title: '产品信息管理',
                path: '/sub4/401',
                component: ProductMsgCtrl
            },
            {
                key: '402',
                title: '优惠券管理',
                path: '/sub4/402',
                component: DiscountCoupon
            }
        ]
    },
    {
        name: 'sub5',
        title: '订单管理',
        children: [
            {
                key: '500',
                title: '产品订单管理',
                path: '/sub5/500',
                component: ProductOrder
            },
            {
                key: '501',
                title: '预定订单管理',
                path: '/sub5/501',
                component: ReserveOrder
            }
        ]
    },
    {
        name: 'sub6',
        title: '微广场信息管理',
        children: [
            {
                key: '600',
                title: '信息管理',
                path: '/sub6/600',
                component: MessageAdmin
            }
        ]
    },
    {
        name: 'sub7',
        title: '平台释放记录',
        children: [
            {
                key: '700',
                title: '每日释放记录',
                path: '/sub7/700',
                component: Release
            },
            {
                key: '701',
                title: '提成记录',
                path: '/sub7/701',
                component: Royalty
            }
        ]
    },
    {
        name: 'sub9',
        title: '平台管理',
        children: [
            {
                key: '900',
                title: '平台阈值管理',
                path: '/sub9/900',
                component: ThresholdValue
            },
            {
                key: '901',
                title: '操作员管理',
                path: '/sub9/901',
                component: Operator
            }
        ]
    },
    {
        name: 'sub10',
        title: '轮播管理',
        children: [
            {
                key: '1000',
                title: '轮播管理',
                path: '/sub10/1000',
                component: Banner
            }
        ]
    }
]