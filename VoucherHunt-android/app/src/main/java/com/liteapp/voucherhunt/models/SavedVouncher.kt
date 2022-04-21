package com.liteapp.voucherhunt.models

class SavedVoucher(id: Long, cloudId:String?)
{
    val mId = id
    val mCloudId = cloudId

    companion object {
        val TABLE_NAME = "savedVouchers"

        val COLUMN_ID = "id"
        val COLUMN_CLOUD_ID = "cloudId"
        val COLUMN_TIMESTAMP = "timestamp"

        // Create table SQL query
        val CREATE_TABLE = (
                "CREATE TABLE " + TABLE_NAME + "("
                        + COLUMN_ID + " INTEGER PRIMARY KEY,"
                        + COLUMN_CLOUD_ID + " TEXT,"
                        + COLUMN_TIMESTAMP + " DATETIME DEFAULT CURRENT_TIMESTAMP"
                        + ")")

    }

}