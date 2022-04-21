package com.liteapp.voucherhunt.presenters

import com.liteapp.voucherhunt.view.VoucherListView

import android.content.Context
import android.util.Log
import com.google.firebase.firestore.FieldPath
import com.google.firebase.firestore.ktx.*
import com.google.firebase.ktx.Firebase
import com.liteapp.voucherhunt.core.CoreManager
import com.liteapp.voucherhunt.models.Voucher
import com.liteapp.voucherhunt.view.MainView

class VoucherListPresenterImpl(val mCtx: Context, val view: VoucherListView):VoucherListPresenter{

    private val dpHelper = CoreManager.getInstance().dbHelper

    val data = mutableListOf<Voucher>()
    init{

    }


    override fun onVouchersUpdate() {
        view.updateVouchers()
    }

    override fun onVoucherSave(voucher: Voucher) {
        Log.d("APP", "onVoucherSave")
        dpHelper.addSavedVoucher(voucher.id)
    }

    override fun onVoucherRemoveSave(voucher: Voucher) {
        dpHelper.deleteSavedVoucher(voucher.id)
    }

    override fun loadVouhcers() {

        val db = Firebase.firestore
        db.collection("vouchers")
            .get()
            .addOnSuccessListener { result ->
                for (document in result) {
                    val voucher = document.toObject<Voucher>().withId(document.id)
                    data.add(voucher)
                }

                onVouchersUpdate()

            }
            .addOnFailureListener { exception ->
                Log.w( "APP", "Error getting documents.", exception)
            }
    }

    override fun loadVouhcers(ids: List<String>) {
        data.clear()
        val db = Firebase.firestore
        db.collection("vouchers")
            .whereIn(FieldPath.documentId(), ids)
            .get()
            .addOnSuccessListener { result ->
                Log.w("APP", "" + result.size())
                for (document in result) {
                    val voucher = document.toObject<Voucher>().withId(document.id)
                    data.add(voucher)
                }
                onVouchersUpdate()
            }
            .addOnFailureListener { exception ->
                Log.w("APP", "Error getting documents.", exception)
            }
    }

    override fun onVoucherClick(voucher: Voucher) {
        view.openVoucherDetail(voucher)
    }

}