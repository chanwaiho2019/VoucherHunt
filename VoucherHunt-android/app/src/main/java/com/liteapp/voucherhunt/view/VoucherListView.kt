package com.liteapp.voucherhunt.view

import com.liteapp.voucherhunt.models.Voucher

interface VoucherListView {

    fun updateVouchers()
    fun openVoucherDetail(voucher: Voucher)
}