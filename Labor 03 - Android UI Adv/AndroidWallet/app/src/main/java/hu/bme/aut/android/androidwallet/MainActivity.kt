package hu.bme.aut.android.androidwallet

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuItem
import android.widget.Toast
import com.google.android.material.snackbar.Snackbar
import hu.bme.aut.android.androidwallet.databinding.ActivityMainBinding
import hu.bme.aut.android.androidwallet.databinding.SalaryRowBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var rowBinding: SalaryRowBinding

    private var summ = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.saveButton.setOnClickListener {
            if (binding.salaryName.text.isEmpty() ||binding.salaryAmount.text.isEmpty()) {
                Snackbar.make(binding.root, R.string.warm_message, Snackbar.LENGTH_LONG).show()
                return@setOnClickListener
            }

            if (binding.expenseOrIncome.isChecked) {
                summ -= binding.salaryAmount.text.toString().toInt()
            } else {
                summ += binding.salaryAmount.text.toString().toInt()
            }

            binding.sum.setText((summ.toString()))

            rowBinding = SalaryRowBinding.inflate(layoutInflater)

            rowBinding.salaryDirectionIcon.setImageResource(if (binding.expenseOrIncome.isChecked) R.drawable.ic_expense else R.drawable.ic_income)
            rowBinding.rowSalaryName.text = binding.salaryName.text.toString()
            rowBinding.rowSalaryAmount.text = binding.salaryAmount.text.toString()

            binding.listOfRows.addView(rowBinding.root)

        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_main, menu)
        return super.onCreateOptionsMenu(menu)
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_delete_all -> {
                binding.listOfRows.removeAllViews()
                summ = 0
                binding.sum.setText("")
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
}