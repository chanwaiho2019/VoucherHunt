package com.liteapp.voucherhunt.presenters

import com.liteapp.voucherhunt.models.Voucher

interface VoucherListPresenter{

    fun onVouchersUpdate()
    fun onVoucherSave(voucher: Voucher)
    fun onVoucherRemoveSave(voucher: Voucher)
    fun loadVouhcers()
    fun loadVouhcers(ids: List<String>)

    fun onVoucherClick(voucher: Voucher)

}