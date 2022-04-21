package com.liteapp.voucherhunt.core


import android.content.Context
import android.graphics.drawable.Drawable
import com.liteapp.voucherhunt.helpers.DatabaseHelper
import java.io.InputStream
import java.net.URL


class CoreManager(context:Context){

    private val mCtx = context
//    private var mWallet:Wallet = Wallet("HKD", "FirstWallet")
    val dbHelper = DatabaseHelper(mCtx)
//    var user: User? = null
    var savedVouchers = dbHelper.getSavedVouchers()
    init{
//        user = dbHelper.getUser()
    }

    fun updateSavedVoucher(){
        savedVouchers = dbHelper.getSavedVouchers()
    }

    companion object {
        private var mInstance: CoreManager? = null

        @Synchronized
        fun getInstance(context:Context): CoreManager {
            if(mInstance == null)
                mInstance = CoreManager(context.applicationContext)

            return mInstance!!
        }

        @Synchronized
        fun getInstance(): CoreManager {
            return mInstance!!
        }
    }


}
