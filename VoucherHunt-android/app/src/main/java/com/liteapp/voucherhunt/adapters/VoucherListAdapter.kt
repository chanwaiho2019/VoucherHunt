package com.liteapp.voucherhunt.adapters

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import com.liteapp.voucherhunt.R
import com.liteapp.voucherhunt.VoucherDetailActivity
import com.liteapp.voucherhunt.core.CoreManager
import com.liteapp.voucherhunt.helpers.LoadImageFromWebOperations
import com.liteapp.voucherhunt.models.Voucher
import com.liteapp.voucherhunt.presenters.MainPresenter
import com.liteapp.voucherhunt.presenters.VoucherListPresenter
import com.squareup.picasso.Picasso
import kotlinx.android.synthetic.main.voucher_view.view.*

class VoucherListAdapter(private val data: MutableList<Voucher>, val mCtx: Context, val voucherListPresenter: VoucherListPresenter) :
    RecyclerView.Adapter<VoucherListAdapter.VoucherViewHolder>() {

    //View holder reference for the ui
    class VoucherViewHolder(val view: CardView) : RecyclerView.ViewHolder(view){
        val titleTxt = view.title
        val descriptionTxt = view.description
        val image_holder = view.image_holder
        val saveBtn = view.save_btn
        val detailBtn = view.detail_btn
    }

    private val dpHelper = CoreManager.getInstance().dbHelper



    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(parent: ViewGroup,
                                    viewType: Int): VoucherListAdapter.VoucherViewHolder {
        // create a new view
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.voucher_view, parent, false) as CardView
        // set the view's size, margins, paddings and layout parameters

        return VoucherViewHolder(view)
    }

    // Replace the contents of a view (invoked by the layout manager)
    override fun onBindViewHolder(holder: VoucherViewHolder, position: Int) {

        holder.titleTxt.text = data[position].title
        holder.descriptionTxt.text = data[position].description

        holder.saveBtn.isSelected = if(data[position].id in CoreManager.getInstance().savedVouchers) true else false

        Log.d("APP", "Voucher " + data[position].title)
        Log.d("APP", "Voucher " + data[position].image)
        if(data[position].image.length > 0){

            Picasso.get()
                .load(data[position].image)
                .into(holder.image_holder, object: com.squareup.picasso.Callback {
                    override fun onSuccess() {
                        //set animations here
                    }
                    override fun onError(e: java.lang.Exception?) {
                        //do smth when there is picture loading error
                    }
                })
        }

        holder.saveBtn.setOnClickListener {
            if(holder.saveBtn.isSelected)
                voucherListPresenter.onVoucherRemoveSave(data[position])
            else
                voucherListPresenter.onVoucherSave(data[position])

            holder.saveBtn.isSelected = !holder.saveBtn.isSelected
        }

        holder.detailBtn.setOnClickListener{
            voucherListPresenter.onVoucherClick(data[position])
        }
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = data.size
}