package com.liteapp.voucherhunt.presenters

import com.liteapp.voucherhunt.models.Voucher

interface SavePresenter {

    fun onVoucherSave(voucher: Voucher)
    fun onVoucherClick()
}