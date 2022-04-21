package com.liteapp.voucherhunt.fragments

import android.content.Intent
import android.media.Image
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.firebase.firestore.FieldPath
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.firestore.ktx.toObject
import com.google.firebase.ktx.Firebase
import com.liteapp.voucherhunt.R
import com.liteapp.voucherhunt.VoucherDetailActivity
import com.liteapp.voucherhunt.adapters.VoucherListAdapter
import com.liteapp.voucherhunt.core.CoreManager
import com.liteapp.voucherhunt.models.Voucher
import com.liteapp.voucherhunt.presenters.VoucherListPresenterImpl
import com.liteapp.voucherhunt.view.SaveView
import com.liteapp.voucherhunt.view.VoucherListView
import com.squareup.picasso.Picasso
import com.stfalcon.imageviewer.StfalconImageViewer
import kotlinx.android.synthetic.main.fragment_main.*
import kotlinx.android.synthetic.main.fragment_main.view.*

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Use the [SaveFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class SaveFragment : Fragment(), VoucherListView, SaveView {
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null

    private lateinit var recyclerView: RecyclerView
    private lateinit var viewAdapter: RecyclerView.Adapter<*>
    private lateinit var viewManager: RecyclerView.LayoutManager
    private lateinit var voucherListPresenter: VoucherListPresenterImpl

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            param1 = it.getString(ARG_PARAM1)
            param2 = it.getString(ARG_PARAM2)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val rootView = inflater.inflate(R.layout.fragment_save, container, false)
        (activity as AppCompatActivity?)!!.setSupportActionBar(toolbar)

        voucherListPresenter = VoucherListPresenterImpl(activity as AppCompatActivity, this)

        viewManager = LinearLayoutManager(activity as AppCompatActivity)
        viewAdapter = VoucherListAdapter(voucherListPresenter.data, activity as AppCompatActivity, voucherListPresenter)

        CoreManager.getInstance().updateSavedVoucher()
        recyclerView = rootView.recyclerView.apply {
            setHasFixedSize(true)
            layoutManager = viewManager
            adapter = viewAdapter

        }


        if(CoreManager.getInstance().savedVouchers.keys.size > 0){
            voucherListPresenter.loadVouhcers(CoreManager.getInstance().savedVouchers.keys.toList())
        }


        return rootView
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment SaveFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            SaveFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }

    override fun updateVouchers() {
        Log.d("APP","update " + voucherListPresenter.data.size)
        viewAdapter.notifyDataSetChanged()
    }

    override fun openVoucherDetail(voucher: Voucher) {
        val intent = Intent(activity, VoucherDetailActivity::class.java).apply {
            putExtra("voucher", voucher)
        }
        this.startActivity(intent)
        activity!!.overridePendingTransition(R.animator.fade_in, R.animator.fade_out)
    }


    override fun onResume() {
        super.onResume()
        updateVouchers()
    }
}