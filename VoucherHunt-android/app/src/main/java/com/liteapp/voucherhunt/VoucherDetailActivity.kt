package com.liteapp.voucherhunt

import android.content.Intent
import android.media.Image
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.MenuItem
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.graphics.drawable.toBitmap
import com.liteapp.voucherhunt.core.CoreManager
import com.liteapp.voucherhunt.models.Voucher
import com.squareup.picasso.Picasso
import com.stfalcon.imageviewer.StfalconImageViewer
import kotlinx.android.synthetic.main.activity_voucher_detail.*


class VoucherDetailActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_voucher_detail)
        setSupportActionBar(findViewById(R.id.toolbar))
        supportActionBar!!.setDisplayHomeAsUpEnabled(true)

        var voucher = intent.getParcelableExtra<Voucher>("voucher")
        supportActionBar!!.title = voucher!!.title

        CoreManager.getInstance().updateSavedVoucher()
        saveBtn.isSelected = if(voucher.id in CoreManager.getInstance().savedVouchers) true else false
        val dpHelper = CoreManager.getInstance().dbHelper
        saveBtn.setOnClickListener {
            if(saveBtn.isSelected)
                dpHelper.deleteSavedVoucher(voucher.id)
            else
                dpHelper.addSavedVoucher(voucher.id)

            CoreManager.getInstance().updateSavedVoucher()
            saveBtn.isSelected = !saveBtn.isSelected
        }

        if(voucher.image.length > 0){
            Picasso.get()
                .load(voucher.image)
                .into(image_view, object: com.squareup.picasso.Callback {
                    override fun onSuccess() {
                        //set animations here
                    }
                    override fun onError(e: java.lang.Exception?) {
                        //do smth when there is picture loading error
                    }
                })

        }


        image_view.setOnClickListener {
            StfalconImageViewer.Builder<Voucher>(this, arrayListOf<Voucher>(voucher)) { view, voucher ->
                Picasso.get().load(voucher.image).into(view)
            }.withTransitionFrom(image_view).show()

        }

        shopTxt.text = voucher.title
        descriptionTxt.text = voucher.description

        moreInfoBtn.setOnClickListener {
            val uri: Uri =
                Uri.parse(voucher.url) // missing 'http://' will cause crashed

            val intent = Intent(Intent.ACTION_VIEW, uri)
            startActivity(intent)
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        // handle arrow click here
        if (item.getItemId() === android.R.id.home) {
            finish() // close this activity and return to preview activity (if there is any)
            overridePendingTransition(R.animator.fade_in, R.animator.fade_out)
        }
        return super.onOptionsItemSelected(item)
    }

    override fun onBackPressed() {
        finish() // close this activity and return to preview activity (if there is any)
        overridePendingTransition(R.animator.fade_in, R.animator.fade_out)
    }
}