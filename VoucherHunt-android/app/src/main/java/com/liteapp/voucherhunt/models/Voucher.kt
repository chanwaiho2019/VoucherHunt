package com.liteapp.voucherhunt.models

import android.os.Parcelable
import com.google.firebase.Timestamp
import com.google.firebase.firestore.GeoPoint
import com.google.firebase.firestore.PropertyName
import kotlinx.android.parcel.Parcelize


@Parcelize
data class Voucher(@PropertyName("id") var id: String,
                   @PropertyName("date") var date: Timestamp,
                   @PropertyName("image") var image:String="",
                   @PropertyName("description") var description:String="",
//                   @PropertyName("location") var location: GeoPoint,
                   @PropertyName("title") var title:String,
                   @PropertyName("url") var url:String,
                   @PropertyName("tags") var tags:List<String>): Parcelable
{
    constructor() : this("",
                    Timestamp.now(),
                    "",
                    "",
//                    GeoPoint(0.0,0.0),
                    "",
                    "",
                    emptyList<String>()
    )

    fun withId(id: String):Voucher{
        this.id = id
        return this
    }

}