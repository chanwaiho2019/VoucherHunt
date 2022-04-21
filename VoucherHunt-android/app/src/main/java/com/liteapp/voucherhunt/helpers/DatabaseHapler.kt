package com.liteapp.voucherhunt.helpers


import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import android.util.Log
import com.liteapp.voucherhunt.models.SavedVoucher
import java.text.SimpleDateFormat
import java.util.*


class DatabaseHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    private val mCtx = context

    // Creating Tables
    override fun onCreate(db: SQLiteDatabase) {
        Log.d("CREATE table", "CREATE TABLE")

        // create notes table
        db.execSQL(SavedVoucher.CREATE_TABLE)

    }

    // Upgrading database
    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // Drop older table if existed
        db.execSQL("DROP TABLE IF EXISTS " + SavedVoucher.TABLE_NAME)
        // Create tables again
        onCreate(db)
    }

    fun addSavedVoucher(_cloudId: String):Boolean
    {
        //Create and/or open a database that will be used for reading and writing.
        val db = this.writableDatabase
        val values = ContentValues()
        values.put(SavedVoucher.COLUMN_CLOUD_ID, _cloudId)
        val date = Date(System.currentTimeMillis())
        values.put(SavedVoucher.COLUMN_TIMESTAMP, date.time)

        val _success = db.insert(SavedVoucher.TABLE_NAME, null, values)
        db.close()

        if(Integer.parseInt("$_success") != -1)
        {
            return true
        }
        return false
    }


    fun deleteSavedVoucher(id: String):Boolean
    {
        val db = this.writableDatabase
        val ret = db.delete(
            SavedVoucher.TABLE_NAME, SavedVoucher.COLUMN_CLOUD_ID + " = '" + id+"'",
            null
        ) > 0

        db.close()

        return ret
    }

    fun getSavedVouchers():MutableMap<String, SavedVoucher>
    {
        var ret = mutableMapOf<String, SavedVoucher>()
        val db = this.writableDatabase
        val cusrsor: Cursor

        var queryStr = "SELECT *"+
                                " FROM "+SavedVoucher.TABLE_NAME


        cusrsor = db.rawQuery(queryStr, null)

        if (cusrsor != null) {
            if (cusrsor.count > 0) {
                cusrsor.moveToFirst()
                do {
                    val id = cusrsor.getLong(cusrsor.getColumnIndex(SavedVoucher.COLUMN_ID))
                    val cloudId = cusrsor.getString(cusrsor.getColumnIndex(SavedVoucher.COLUMN_CLOUD_ID))
                    ret[cloudId] = SavedVoucher(id, cloudId)
                } while (cusrsor.moveToNext())
            }
        }
        return ret
    }



    companion object {

        // Database Version
        private val DATABASE_VERSION = 1

        // Database Name
        private val DATABASE_NAME = "VoucherHunt"
    }
}